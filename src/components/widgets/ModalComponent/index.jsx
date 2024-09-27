import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CancelIcon from "@mui/icons-material/Cancel";

const ModalMessage = ({
  open,
  setOpen,
  title,
  titleBtnAceptar="Si",
  titelBtnCancelar = "Cancelar",
  onBtnAceptar,
  children,
  showButtons = true,
  isMessage = false,
}) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-1000"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
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

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto text-black">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div //Dialog.Panel
                className={`relative transform overflow-hidden rounded-lg bg-white text-black text-left shadow-xl transition-all sm:my-8 mx-2 md:mx-8 w-full sm:w-4/5 ${
                  isMessage ? "md:w-3/5 xl:w-1/3" : "md:w-10/12 lg:w-4/5 xl:w-2/3"
                }`}
              >
                <div className="bg-color-rojoReyPlast modal-header">
                  <h1>{title}</h1>
                  <button onClick={() => setOpen(false)}>
                    <CancelIcon sx={{ fontSize: "2em" }} />
                  </button>
                </div>
                <div className={`p-4`} style={showButtons ? { maxHeight: "75vh" } : { maxHeight: "80vh" }}>
                  {showButtons ? (
                    <div className="modal-children-content">{children}</div>
                  ) : (
                    children
                  )}
                </div>
                {showButtons && (
                  <div className="bg-gray-50 px-4 mb-3 sm:flex sm:flex-row-reverse sm:px-6 md:columns-2">
                    <button
                      type="button"
                      className="flex w-full col-span-1 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3"
                      onClick={onBtnAceptar}
                    >
                      {titleBtnAceptar}
                    </button>
                    <button
                      type="button"
                      className="flex w-full col-span-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 items-center"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      {titelBtnCancelar}
                    </button>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalMessage;
