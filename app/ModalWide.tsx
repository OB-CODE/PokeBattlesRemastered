'use client';
import { Fragment, ReactNode, useState } from 'react';
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

export default function ModalWide({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: ReactNode;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full  justify-center p-4 text-center sm:items-center sm:p-0 items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform flex flex-col max-h-[85vh] rounded-lg bg-white pl-3 pr-2 pb-3 pt-4 text-left shadow-xl transition-all sm:my-6 sm:w-full sm:max-w-xl sm:pl-4 sm:pr-3 sm:pb-4 sm:pt-4">
                <div className="flex-1 overflow-y-auto pr-2">
                  {content}
                </div>
                <div className="mt-4 sm:mt-5">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => onClose()}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
