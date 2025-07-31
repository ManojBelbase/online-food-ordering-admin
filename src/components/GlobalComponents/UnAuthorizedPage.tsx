// pages/Unauthorized.tsx
import { useNavigate } from "react-router-dom";
import { CustomText, ActionButton } from "../ui";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "3rem", textAlign: "center", margin:"auto"}}>
      <CustomText size="xl">
        🚫 You are not authorized to access this page.
      </CustomText>
      <ActionButton
        onClick={() => navigate("/")}
        variant="primary"
        style={{ marginTop: "16px" }}
      >
        Go to Dashboard
      </ActionButton>
    </div>
  );
};

export default UnauthorizedPage;
