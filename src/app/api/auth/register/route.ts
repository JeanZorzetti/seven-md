import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, cpf } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Já existe uma conta com este e-mail' }, { status: 409 })
    }

    if (cpf) {
      const existingCpf = await prisma.user.findUnique({ where: { cpf } })
      if (existingCpf) {
        return NextResponse.json({ error: 'Já existe uma conta com este CPF' }, { status: 409 })
      }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: { name, email, passwordHash, phone: phone || null, cpf: cpf || null, role: 'PATIENT' },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Register error:', message)
    const isDbError = /connect|ECONNREFUSED|prisma/i.test(message)
    return NextResponse.json(
      { error: isDbError ? 'Erro de conexão. Tente novamente em instantes.' : message },
      { status: 500 }
    )
  }
}
