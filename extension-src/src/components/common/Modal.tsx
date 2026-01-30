import { X } from "lucide-react";
import React, { useRef, useEffect, ReactNode, CSSProperties, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  rootClassName?: string;
  rootStyle?: CSSProperties;
  closeOnClickOutside?: boolean;
  closeButtonStyle?: CSSProperties;
  closeOnEsc?: boolean;
  preventBodyScroll?: boolean;
  portalContainerClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = "600px",
  containerClassName = "",
  containerStyle = {},
  rootClassName = "",
  rootStyle = {},
  closeButtonStyle = {},
  closeOnClickOutside = true,
  closeOnEsc = true,
  preventBodyScroll = true,
  portalContainerClassName = " LBTANN-tw-scope LBTANN-custom-zindex ",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!preventBodyScroll) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, preventBodyScroll]);

  useEffect(() => {
    if (!closeOnEsc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeOnEsc, isOpen, onClose]);

  const handleCancel = useCallback(
    (e: React.SyntheticEvent<HTMLDialogElement>) => {
      if (!closeOnClickOutside) {
        e.preventDefault();
      } else {
        onClose();
      }
    },
    [closeOnClickOutside, onClose]
  );

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnClickOutside) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`LBTANN-fixed LBTANN-inset-0 LBTANN-z-50 LBTANN-flex !LBTANN-bg-transparent backdrop:LBTANN-items-center backdrop:LBTANN-justify-center backdrop:LBTANN-bg-black/50 ${portalContainerClassName} ${rootClassName}`}
      style={rootStyle}
      onCancel={handleCancel}
      onClick={handleDialogClick}
    >
      <div
        className={`LBTANN-bg-white LBTANN-w-full LBTANN-rounded LBTANN-shadow-lg LBTANN-relative LBTANN-overflow-hidden ${containerClassName}`}
        style={{ maxWidth, ...containerStyle }}
      >
        <button
          onClick={onClose}
          className="LBTANN-z-20 LBTANN-absolute LBTANN-p-2 LBTANN-top-2 LBTANN-right-2 LBTANN-rounded-full LBTANN-flex LBTANN-items-center LBTANN-justify-center"
          style={{ color: containerStyle.color, ...closeButtonStyle }}
          aria-label="Close"
          type="button"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
