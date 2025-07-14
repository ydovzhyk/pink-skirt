import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PiLineVertical } from 'react-icons/pi'
import { getScreenType } from '@/redux/technical/technical-selectors'
import { getLogin, getUser } from '@/redux/auth/auth-selectors'
import { logout } from '@/redux/auth/auth-operations'
import Text from '@/components/shared/text/text';
import Image from 'next/image';
import Button from '@/components/shared/button/button';
// import AddUserPanel from '@/components/add-user-panel/add-user-panel';

const AuthInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isUserLogin = useSelector(getLogin);
  const screenType = useSelector(getScreenType);
  const user = useSelector(getUser);

  const greeting = `Hi, ${user.username ? user.username : 'User'}`;

  const onLogout = () => {
    dispatch(logout());
  };

  const navigateToAddProperty = () => {
    router.push('/add-property');
  };

  return (
    <>
      {!isUserLogin && (
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center gap-[5px]">
            <Link href="/login" className="w-full group cursor-pointer">
              <Text
                type="small"
                as="p"
                fontWeight="light"
                className="text-white group-hover:text-[var(--accent)] hover-transition"
              >
                Login
              </Text>
            </Link>
            <div>
              <PiLineVertical size={24} color="white" />
            </div>
            <Link href="/registration" className="w-full group cursor-pointer">
              <Text
                type="small"
                as="p"
                fontWeight="light"
                className="text-white group-hover:text-[var(--accent)] hover-transition"
              >
                Registration
              </Text>
            </Link>
          </div>
        </div>
      )}
      {isUserLogin && screenType !== 'isMobile' && (
        <div className="flex flex-row items-center justify-between gap-[15px]">
          <div className="mr-[20px]">
            <Button
              text="List your property"
              btnClass="btnLight"
              textColor="white"
              onClick={navigateToAddProperty}
              width='200px'
            />
          </div>
          {/* <AddUserPanel /> */}
          <div className="flex flex-row items-center justify-between gap-[10px] w-[45px] h-[45px] bg-white rounded-full">
            {user.userAvatar !== null && (
              <Image
                src={user.userAvatar}
                alt="Userphoto"
                width={45}
                height={45}
                className="rounded-full"
              />
            )}
          </div>
          <Link href="/user" className="group cursor-pointer">
            <Text
              type="small"
              as="p"
              fontWeight="light"
              className="text-white group-hover:text-[var(--accent)] hover-transition"
            >
              {greeting}
            </Text>
          </Link>
          <PiLineVertical
            size={24}
            color="white"
            style={{ marginLeft: '-10px', marginRight: '-10px' }}
          />
          <button
            type="button"
            onClick={onLogout}
            className="flex flex-row items-center justify-center bg-transparent hover-transition group mt-[2px]"
          >
            <Text
              type="small"
              as="span"
              fontWeight="light"
              className="text-white group-hover:text-[var(--accent)]"
            >
              Exit
            </Text>
          </button>
        </div>
      )}
      {isUserLogin && screenType === 'isMobile' && (
        <div className="flex flex-row items-center justify-between gap-[15px]">
          <button
            type="button"
            onClick={onLogout}
            className="flex flex-row items-center justify-center bg-transparent hover-transition group mt-[2px]"
          >
            <Text
              type="small"
              as="span"
              fontWeight="light"
              className="text-white group-hover:text-[var(--accent)]"
            >
              Exit
            </Text>
          </button>
        </div>
      )}
    </>
  );
};

export default AuthInfo;
