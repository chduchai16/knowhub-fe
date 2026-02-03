'use server';
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

export async function deleteCookieAndRedirect(cookieName: string, redirectPath: string) {
    const cookieStore = await cookies()
    cookieStore.delete(cookieName)
    redirect(redirectPath)
}
