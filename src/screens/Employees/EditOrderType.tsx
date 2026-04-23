import { useEditEmployee } from "@/hooks/useEditEmployee";
import { Button, Modal, Select } from "@mantine/core";
import { useState } from "react";

interface AssignInquiryEmployeeToGovernorateProps {
  id: number;
  ordertype?: string;
  opened: boolean;
  close: () => void;
  open: () => void;
  closeMenu: () => void;
}

export const AssignOrderType = ({
  id,
  ordertype,
  close,
  closeMenu,
  open,
  opened,
}: AssignInquiryEmployeeToGovernorateProps) => {
  const [selectedtype, setSelectedType] = useState<string | undefined>(
    ordertype
  );

  const { mutate: editEmployeeCompanies, isLoading } = useEditEmployee();

  const handleClose = () => {
    close();
    closeMenu();
  };

  const handleSubmit = () => {
    const formData = new FormData();
    selectedtype ? formData.append("orderType", selectedtype) : null;
    editEmployeeCompanies(
      {
        id,
        data: formData,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: () => {
          setSelectedType(ordertype);
        },
      }
    );
  };

  return (
    <>
      <Modal
        title="اضافة نوع البريد"
        opened={opened}
        onClose={handleClose}
        centered>
        <Select
          value={selectedtype}
          label="نوع البريد"
          searchable
          clearable
          onChange={(e) => {
            setSelectedType(e || undefined);
          }}
          placeholder="اختر نوع البريد"
          data={[
            { value: "forwarded", label: "البريد الصادر" },
            { value: "receiving", label: "البريد الوارد" },
          ]}
          limit={100}
        />
        <div className="flex justify-between mt-4 gap-6">
          <Button
            loading={false}
            disabled={isLoading}
            fullWidth
            onClick={handleSubmit}
            type="submit">
            تعديل
          </Button>

          <Button
            onClick={() => {
              handleClose();
            }}
            fullWidth
            variant="outline">
            الغاء
          </Button>
        </div>
      </Modal>

      <Button fullWidth onClick={open}>
        تغير نوع البريد
      </Button>
    </>
  );
};
