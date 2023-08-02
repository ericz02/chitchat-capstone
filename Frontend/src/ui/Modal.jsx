import { CgCloseR } from "react-icons/cg";
<<<<<<< HEAD

=======
>>>>>>> 2be2d4bd952578bafaca905404b225149309c7b6
function Modal({ children, isVisible, hideModal }) {
  if (!isVisible) {
    return null;
  }
  return (
    <div className="relative flex justify-end items-center px-4">
      <div
<<<<<<< HEAD
        className="fixed inset-0 bg-black opacity-50 "
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute flex flex-col items-center mt-4 max-w-xl w-144 px-4 bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out"
=======
        className="fixed inset-0 bg-black opacity-50"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-4 absolute flex flex-col items-center max-w-xl w-144 mt-12 px-4 bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out"
>>>>>>> 2be2d4bd952578bafaca905404b225149309c7b6
      >
        <CgCloseR
          onClick={hideModal}
          className="text-black text-xl m-2 "
       />
<<<<<<< HEAD
  
=======
>>>>>>> 2be2d4bd952578bafaca905404b225149309c7b6
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
export default Modal;