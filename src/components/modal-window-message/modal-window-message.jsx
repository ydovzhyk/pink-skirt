'use client';

import { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearTechnicalMessage,
  clearTechnicalError,
} from '@/redux/technical/technical-slice'
import {
  clearUserMessage,
  clearUserError,
} from '@/redux/auth/auth-slice'
import {
  getAuthMessage,
  getAuthError,
} from '@/redux/auth/auth-selectors'
import {
  getTechnicalError,
  getTechnicalMessage,
  getModalVindowSttus,
} from '@/redux/technical/technical-selectors'
import { setModalWindowStatus } from '@/redux/technical/technical-slice'
import { TfiClose } from 'react-icons/tfi'
import Text from '@/components/shared/text/text'

const ModalWindow = () => {
  const modalRef = useRef(null)
  const dispatch = useDispatch()
  const messageAuth = useSelector(getAuthMessage);
  const messageTechnical = useSelector(getTechnicalMessage);
  const errorAuth = useSelector(getAuthError);
  const errorTechnical = useSelector(getTechnicalError);
  const modalWindowStatus = useSelector(getModalVindowSttus);

  const [isError, setIsError] = useState(false);

  const clearAllState = useCallback(() => {
    dispatch(setModalWindowStatus(false));
    dispatch(clearTechnicalError());
    dispatch(clearTechnicalMessage());
    dispatch(clearUserError());
    dispatch(clearUserMessage());
    setIsError(false);
  }, [dispatch]);

  useEffect(() => {
    if (
      messageAuth ||
      messageTechnical ||
      errorAuth ||
      errorTechnical
    ) {
      dispatch(setModalWindowStatus(true));
      if (errorAuth || errorTechnical) {
        setIsError(true);
      }
    } else {
      return;
    }
  }, [
    dispatch,
    messageAuth,
    messageTechnical,
    errorAuth,
    errorTechnical,
  ]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        modalRef.current &&
        e.target instanceof Node &&
        !modalRef.current.contains(e.target)
      ) {
        clearAllState()
      }
    }

    let timeoutId;
    if (!modalWindowStatus) {
      return;
    } else {
      timeoutId = setTimeout(() => {
        clearAllState();
      }, 10000);
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      clearTimeout(timeoutId);
    };
  }, [modalWindowStatus, clearAllState]);

  const closeModal = () => {
    clearAllState();
  };

  const errorMessage = `${errorAuth ? errorAuth : errorTechnical ? errorTechnical: ''}`;
  const infoMessage = `${messageAuth ? messageAuth : messageTechnical ? messageTechnical : ''}`;

  return (
    <div
      className={`w-72 min-h-[50px] rounded-lg shadow-lg text-white border
        ${isError ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700'}
        ${!modalWindowStatus ? 'hidden' : 'flex flex-col'}`}
      ref={modalRef}
      style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 200 }}
    >
      <div className="reletive w-[100%] flex flex-col items-center gap-[5px] py-2 px-5">
        <button
          className="absolute top-[5px] right-[10px] w-[20px] h-[20px] flex flex-row items-center justify-center"
          onClick={closeModal}
        >
          <TfiClose color="var(--text-color)" size={15} />
        </button>
        {(errorAuth || errorTechnical) && (
          <>
            <Text type="small" as="p" fontWeight="normal">
              We got an error:
            </Text>
            <Text type="small" as="p" fontWeight="light">
              {errorMessage}
            </Text>
          </>
        )}
        {(messageAuth || messageTechnical) && (
          <>
            <Text type="small" as="p" fontWeight="normal">
              We got a message:
            </Text>
            <Text type="small" as="p" fontWeight="light">
              {infoMessage}
            </Text>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalWindow;
