import { Modal } from "@mantine/core";
import { ActionButton, CustomText } from "../ui";

interface DeleteModalProps {
  opened: boolean;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ opened, itemName, onClose, onConfirm }: DeleteModalProps) => {
  console.log('DeleteModal props:', { opened, itemName });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
    >
      <div>
        <CustomText margin="10px 0 10px 0">
          Are you sure you want to delete <span style={{ fontWeight: 600 }}> {itemName}</span>?
        </CustomText>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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