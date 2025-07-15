import { IconDotsVertical } from "@tabler/icons-react";
import Tippy from "@tippyjs/react";
import { useState } from "react";
import { toast } from "react-toastify";

const Action = ({ onDelete }: { onDelete: () => void }) => {
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
      <div className={`shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] min-w-[160px] p-1.5 rounded-md bg-n0 dark:bg-bg4 verti-option`}>
        <button className="py-2 hover:bg-primary/5 hover:text-primary w-full text-sm text-start rounded-md duration-300 block px-3">Edit</button>
        <button onClick={handleDelete} className="py-2 hover:bg-primary/5 hover:text-primary w-full text-sm text-start rounded-md duration-300 block px-3">
          Delete
        </button>
        <button className="py-2 hover:bg-primary/5 hover:text-primary w-full text-sm text-start rounded-md duration-300 block px-3">Share</button>
      </div>
    );
  };
  return (
    <Tippy className="relative" onClickOutside={hide} interactive={true} visible={visible} placement="bottom-start" content={<Content />} appendTo="parent">
      <span>
        <IconDotsVertical onClick={visible ? hide : show} size={18} className="cursor-pointer" />
      </span>
    </Tippy>
  );
};

export default Action;
