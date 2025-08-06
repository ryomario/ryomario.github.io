import Link from "next/link";

type Props = {
  homeUrl?: string;
}

export function NotFoundComponent({ homeUrl = '/' }: Props) {
  return (
    <div style={{
      boxSizing: 'border-box',
      display: 'grid',
      minHeight: '100%',
      placeItems: 'center',
      backgroundColor: 'white',
      padding: '24px 12px',
      paddingLeft: '32px',
      paddingRight: '32px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#4f46e5'
        }}>
          404
        </p>
        <h1 style={{
          marginTop: '1rem',
          fontSize: '3rem',
          fontWeight: 600,
          letterSpacing: '-0.025em',
          textWrap: 'balance',
          color: '#111827',
        }}>
          Page not found
        </h1>
        <p style={{
          marginTop: '1.5rem',
          fontSize: '1.125rem',
          fontWeight: 500,
          textWrap: 'pretty',
          color: '#6b7280',
          lineHeight: '2rem'
        }}>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div style={{
          marginTop: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          <Link
            href={homeUrl} 
            style={{
              borderRadius: '0.375rem',
              backgroundColor: '#4f46e5',
              padding: '0.625rem 0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'white',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            }}
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}