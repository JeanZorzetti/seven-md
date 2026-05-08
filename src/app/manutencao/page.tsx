import Image from 'next/image'

export default function ManutencaoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <Image
          src="/Logos/logo seven md4-01.png"
          alt="Seven-MD"
          width={180}
          height={60}
          className="mx-auto h-14 w-auto"
        />

        <div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #af101a, #d32f2f)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>
            Em manutenção
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Estamos realizando melhorias no site. Voltamos em breve com novidades!
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-400">
            Precisa de ajuda?{' '}
            <a href="mailto:contato@seven-md.com.br" className="font-medium hover:underline" style={{ color: '#af101a' }}>
              contato@seven-md.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
