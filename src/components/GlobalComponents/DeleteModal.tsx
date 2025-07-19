import { Modal, Button } from "@mantine/core";

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
        <p>Are you sure you want to delete {itemName}?</p>
        <Button color="red" onClick={onConfirm} mr="sm">
          Confirm
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;