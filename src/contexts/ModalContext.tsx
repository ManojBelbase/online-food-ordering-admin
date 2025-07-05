import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Modal } from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { useTheme } from "./ThemeContext";

interface ModalConfig
  extends Omit<ModalProps, "opened" | "onClose" | "children" | "content"> {
  id: string;
  body: ReactNode;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

interface ModalContextType {
  openModal: (config: Omit<ModalConfig, "id"> & { id?: string }) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);
  const { theme } = useTheme();

  const openModal = (
    config: Omit<ModalConfig, "id"> & { id?: string }
  ): string => {
    const id =
      config.id ||
      `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const modalConfig: ModalConfig = {
      id,
      closeOnClickOutside: true,
      closeOnEscape: true,
      ...config,
    };

    setModals((prev) => [...prev, modalConfig]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const updateModal = (id: string, updates: Partial<ModalConfig>) => {
    setModals((prev) =>
      prev.map((modal) => (modal.id === id ? { ...modal, ...updates } : modal))
    );
  };

  const value: ModalContextType = {
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}

      {/* Render all modals */}
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          opened={true}
          onClose={() => closeModal(modal.id)}
          closeOnClickOutside={modal.closeOnClickOutside}
          closeOnEscape={modal.closeOnEscape}
          title={modal.title}
          size={modal.size}
          centered={modal.centered}
          fullScreen={modal.fullScreen}
          radius={modal.radius}
          shadow={modal.shadow}
          padding={modal.padding}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
            ...modal.overlayProps,
          }}
          styles={{
            content: {
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
            },
            header: {
              backgroundColor: theme.colors.surface,
              borderBottom: `1px solid ${theme.colors.border}`,
            },
            title: {
              color: theme.colors.textPrimary,
              fontWeight: 600,
            },
            close: {
              color: theme.colors.textSecondary,
              "&:hover": {
                backgroundColor: theme.colors.surfaceHover,
              },
            },
            ...modal.styles,
          }}
          {...modal}
        >
          {modal.body}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const useConfirmModal = () => {
  const { openModal, closeModal } = useModal();

  const openConfirmModal = ({
    title = "Confirm Action",
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmColor = "red",
  }: {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
  }) => {
    const modalId = openModal({
      title,
      size: "sm",
      centered: true,
      body: (
        <div>
          <p style={{ marginBottom: "20px" }}>{message}</p>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <button
              onClick={() => {
                onCancel?.();
                closeModal(modalId);
              }}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                closeModal(modalId);
              }}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                background: confirmColor === "red" ? "#e03131" : "#228be6",
                color: "white",
                cursor: "pointer",
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
    });

    return modalId;
  };

  return { openConfirmModal };
};

export const useFormModal = () => {
  const { openModal, closeModal } = useModal();

  const openFormModal = ({
    title,
    content,
    size = "md",
    onClose,
  }: {
    title: string;
    content: ReactNode;
    size?: string;
    onClose?: () => void;
  }) => {
    const modalId = openModal({
      title,
      size,
      body: content,
      closeOnClickOutside: true,
      closeOnEscape: true,
    });

    // Override close handler if provided
    if (onClose) {
      // This would need to be implemented with a custom close handler
    }

    return {
      modalId,
      close: () => closeModal(modalId),
    };
  };

  return { openFormModal };
};
