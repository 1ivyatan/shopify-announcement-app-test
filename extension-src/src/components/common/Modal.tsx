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
  portalContainerClassName = " TSUFFIX-tw-scope TSUFFIX-custom-zindex ",
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
      className={`TSUFFIX-fixed TSUFFIX-inset-0 TSUFFIX-z-50 TSUFFIX-flex !TSUFFIX-bg-transparent backdrop:TSUFFIX-items-center backdrop:TSUFFIX-justify-center backdrop:TSUFFIX-bg-black/50 ${portalContainerClassName} ${rootClassName}`}
      style={rootStyle}
      onCancel={handleCancel}
      onClick={handleDialogClick}
    >
      <div
        className={`TSUFFIX-bg-white TSUFFIX-w-full TSUFFIX-rounded TSUFFIX-shadow-lg TSUFFIX-relative TSUFFIX-overflow-hidden ${containerClassName}`}
        style={{ maxWidth, ...containerStyle }}
      >
        <button
          onClick={onClose}
          className="TSUFFIX-z-20 TSUFFIX-absolute TSUFFIX-p-2 TSUFFIX-top-2 TSUFFIX-right-2 TSUFFIX-rounded-full TSUFFIX-flex TSUFFIX-items-center TSUFFIX-justify-center"
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
