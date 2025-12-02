import { NextResponse } from 'next/server'
import { getData } from "./get_data"

export const GET = async () => NextResponse.json(await getData())
