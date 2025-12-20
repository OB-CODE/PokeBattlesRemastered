'use client';
import { Fragment, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface ContentProps {
  heading: string;
  body: string | ReactNode;
  closeMessage: string;
  // ? - make these properties optional by adding a ? after the property names in the type definition
  logoBGColour?: string;
  logoColour?: string;
  iconChoice?: React.ReactNode;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  content?: ContentProps;
  children?: ReactNode; // Allow children to be passed to the Modal
}

export default function Modal({
  open,
  onClose,
  content,
  children,
}: ModalProps) {
  const {
    heading = 'Default Heading',
    body = 'Default Body',
    closeMessage = 'Close',
    logoBGColour = 'bg-green-100',
    logoColour = 'text-green-600',
    iconChoice = (
      <CheckIcon className="h-6 w-6 text-black" aria-hidden="true" />
    ),
  } = content || {};

  return (
    typeof window !== 'undefined' && typeof document !== 'undefined'
      ? createPortal(
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-[1100]" onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[1050]" />
            </Transition.Child>

            <div className="fixed inset-0 z-[1100] w-screen overflow-y-auto">
              <div className="flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0 items-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform flex flex-col max-h-[85vh] rounded-lg bg-white pl-3 pr-2 pb-3 pt-4 text-left shadow-xl transition-all sm:my-6 sm:w-full sm:max-w-sm sm:pl-4 sm:pr-3 sm:pb-4 sm:pt-4">
                    <div id='mainModalContent' className="flex-1 overflow-y-scroll pr-2 scrollbar-gutter-stable">
                      {children || (
                        <>
                          <div>
                            <div
                              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${logoBGColour}`}
                            >
                              {iconChoice}
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                              <Dialog.Title
                                as="h3"
                                className="text-[1rem] font-semibold leading-6 text-gray-900"
                              >
                                {heading}
                              </Dialog.Title>
                              <div className="mt-2">
                                <div className="text-sm text-gray-500">{body}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-5">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              onClick={() => onClose()}
                            >
                              {closeMessage}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>,
        document.body
      )
      : null
  );
}
