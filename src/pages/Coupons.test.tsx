import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Coupons from './Coupons'

// Mock API module
vi.mock('../api/coupons', () => {
  return {
    listCoupons: vi.fn(async () => []),
    redeemCoupon: vi.fn(async () => ({})),
  }
})

const { listCoupons, redeemCoupon } = await import('../api/coupons')

function setup() {
  return render(
    <MemoryRouter initialEntries={['/coupons']}>
      <Coupons />
    </MemoryRouter>
  )
}

describe('Coupons', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('muestra estado de carga y luego vacio cuando no hay cupones', async () => {
    ;(listCoupons as any).mockResolvedValueOnce([])
    setup()

    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/no hay cupones/i)).toBeInTheDocument()
    })
  })

  it('renderiza cupones disponibles y permite canjear', async () => {
    const sample = [
      { id: 1, code: 'ABC123', description: '10% OFF', value: 10, expirationDate: new Date().toISOString(), status: 'active' },
    ]
    ;(listCoupons as any)
      .mockResolvedValueOnce(sample) // initial load
      .mockResolvedValueOnce([]) // after redeem reload actives becomes 0

    setup()
    await waitFor(() => {
      expect(screen.getByText('ABC123')).toBeInTheDocument()
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /canjear/i }))

    expect(redeemCoupon).toHaveBeenCalledWith({ code: 'ABC123' })
    await waitFor(() => {
      expect(listCoupons).toHaveBeenCalledTimes(2)
    })
  })
})
