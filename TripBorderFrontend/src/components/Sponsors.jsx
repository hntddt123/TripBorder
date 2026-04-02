export default function Sponsors() {
  return (
    <div className='cardMX1'>
      <div className='grid grid-cols-1 container mx-auto max-w-6xl'>
        <div className='cardInfo p-4'>
          <div className='text-3xl mb-2'>Sponsors</div>
          <div className='flex'>
            <img
              className='rounded-2xl max-h-32 m-2'
              src='/menuImages/buymecoffee-qr-code.png'
              alt='Buy Me a Coffee QR'
            />
          </div>
          <div>
            <a
              className='inline-block'
              href='https://www.buymeacoffee.com/nientaiho7'
              target='_blank'
              rel='noreferrer'
            >
              <img
                className='button max-h-24 m-0'
                src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'
                alt='Buy Me a Coffee'
              />
            </a>
          </div>
          <div className='cardInfo p-4 text-2xl'>
            Sponsors List
            {/* <div className='text-2xl mb-2'></div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
