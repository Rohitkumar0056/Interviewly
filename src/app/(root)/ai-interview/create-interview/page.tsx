import React from 'react'
import Agent from '@/components/Agent'
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

const page = async () => {
  const { userId } = await auth();
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId!);

  return (
    <>
        <h3 className='text-2xl font-semibold ml-20 mt-5'>AI Interview</h3>
        <Agent userName={user.firstName!} userId={userId!} type="generate" />
    </>
  )
}

export default page
