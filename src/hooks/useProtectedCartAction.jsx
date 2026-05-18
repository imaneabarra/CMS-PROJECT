import { useAuth } from './useAuth';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

/**
 * Returns a protected version of addToCart.
 * If the user is not authenticated, shows a luxury error toast
 * instead of adding the item.
 */
export const useProtectedCartAction = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const protectedAddToCart = (product, qty = 1) => {
    if (!user) {
      toast.custom(
        (t) => (
          <div
            style={{
              opacity: t.visible ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: 'linear-gradient(135deg, #0B0F1A 0%, #0F172A 100%)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: '16px',
              padding: '20px 24px',
              maxWidth: '360px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 20px rgba(6,182,212,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>✦</span>
              <p
                style={{
                  color: '#22d3ee',
                  fontWeight: '700',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Members Only
              </p>
            </div>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '12px',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              Please sign in to continue your luxury experience.
            </p>
            <a
              href="/login"
              style={{
                marginTop: '4px',
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-block',
                width: 'fit-content',
              }}
            >
              Sign In →
            </a>
          </div>
        ),
        { duration: 4000 }
      );
      return false;
    }
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#0f1629',
        color: '#e2e8f0',
        border: '1px solid rgba(6,182,212,0.2)',
        borderRadius: '12px',
      },
      icon: '✦',
    });
    return true;
  };

  return { protectedAddToCart };
};
