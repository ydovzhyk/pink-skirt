'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setMessage } from '@/redux/technical/technical-slice'

const SearchParamsHandler = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message')
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (message) {
      dispatch(setMessage(message))
      router.replace('/')
    }
  }, [message, dispatch, router])

  return null;
};

export default SearchParamsHandler;
