import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  heading: ReactNode;
  body: ReactNode;
  iconChoice?: ReactNode;
}

export default function ViewModal({
  open,
  setOpen,
  heading,
  body,
  iconChoice,
}: ViewModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-25 " onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-15 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-25 w-screen overflow-y-hidden">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform flex flex-col max-h-[85vh] rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 text-left shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Gradient header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-xl flex-shrink-0">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-white"
                    >
                      {heading}
                    </Dialog.Title>
                    <div className="absolute top-3 right-4">{iconChoice}</div>
                  </div>

                  <div className="pl-4 pr-2 py-4 overflow-y-scroll flex-1">
                    <div>{body}</div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200"
                    onClick={() => setOpen(false)}
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
