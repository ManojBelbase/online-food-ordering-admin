import { Modal } from "@mantine/core";
import { ActionButton, CustomText } from "../ui";

interface DeleteModalProps {
  opened: boolean;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ opened, itemName, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
    >
      <div>
        <CustomText margin="0 0 16px 0">
          Are you sure you want to delete {itemName}?
        </CustomText>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton variant="error" onClick={onConfirm}>
            Confirm
          </ActionButton>
          <ActionButton variant="outline" onClick={onClose}>
            Cancel
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;