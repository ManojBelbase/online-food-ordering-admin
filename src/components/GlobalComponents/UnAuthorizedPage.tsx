// pages/Unauthorized.tsx
import { Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "3rem", textAlign: "center", margin:"auto"}}>
      <Text size="xl">
        🚫 You are not authorized to access this page.
      </Text>
      <Button mt="md" onClick={() => navigate("/")}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
