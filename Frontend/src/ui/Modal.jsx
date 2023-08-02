function Modal({ children, isVisible, hideModal }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative flex justify-end items-center px-4">
      <div
        onClick={hideModal}
        className="fixed inset-0 bg-black opacity-50"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute flex flex-col items-center max-w-xl w-144 mt-12 px-4 bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out"
      >
        <button
          onClick={hideModal}
          className="text-black text-xl m-2 "
        >
          X
        </button>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

