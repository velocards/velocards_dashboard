import { IconDotsVertical } from "@tabler/icons-react";
import Tippy from "@tippyjs/react";
import { useState } from "react";
import { toast } from "react-toastify";

const Action = ({ onDelete, showDetails }: { onDelete: () => void; showDetails: () => void }) => {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const handleDelete = () => {
    // Using native confirm dialog instead of sweetalert2
    const confirmed = window.confirm("Are you sure? You won't be able to revert this!");
    if (confirmed) {
      onDelete();
      toast.success("Item Deleted Successfully", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const Content = () => {
    return (
      <div className={`min-w-[150px] p-1.5 rounded-md shadow-lg bg-n0 dark:bg-bg4`}>
        <button onClick={showDetails} className="py-1.5 hover:bg-primary/5 hover:text-primary text-sm w-full text-start rounded-md duration-300 block px-3">
          See Details
        </button>
        <button onClick={handleDelete} className="py-1.5 hover:bg-primary/5 hover:text-primary text-sm w-full text-start rounded-md duration-300 block px-3">
          Delete
        </button>
      </div>
    );
  };
  return (
    <Tippy className="relative" onClickOutside={hide} interactive={true} visible={visible} placement="bottom-start" content={<Content />} appendTo="parent">
      <span>
        <IconDotsVertical size={18} onClick={visible ? hide : show} className="cursor-pointer" />
      </span>
    </Tippy>
  );
};

export default Action;
