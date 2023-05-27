import React, { useState } from "react";

import toast from "react-hot-toast";
import { BiSend } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";

import { updateRemarks } from "../../actions/booking";
import { setQaModal } from "../../actions/other";

const QAModal = () => {
  const { isOpen, query } = useSelector((state) => state.other.qaModal);

  const [remarks, setRemarks] = useState("");

  const dispatch = useDispatch();

  const sendRemarks = async () => {
    const res = await dispatch(
      updateRemarks({
        uuid: query.venue.uuid,
        remarks,
      })
    );
    if (res.status == 200) {
      toast.success(res.success);
      setRemarks("");
      dispatch(
        setQaModal({
          isOpen: false,
        })
      );
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Popup
      open={isOpen}
      onClose={() =>
        dispatch(
          setQaModal({
            isOpen: false,
          })
        )
      }
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative">
          <h3 className="mb-4 text-center text-lg font-bold">Q & A</h3>
          <hr />
          <div className="mt-5">
            {query?.remarks && (
              <>
                <div className="flex flex-col items-end">
                  <strong className="mr-1 text-sm uppercase">
                    Your latest remarks
                  </strong>
                  <p className="max-w-[350px] rounded-xl bg-accent p-3 text-sm">
                    {query.remarks}
                  </p>
                </div>
                <div className="mt-5 flex-col items-end">
                  {query.admin_remarks ? (
                    <>
                      <strong className="ml-1 text-sm uppercase">
                        Reply given to you
                      </strong>
                      <p className="max-w-[350px] rounded-xl bg-base-200 p-3 text-sm">
                        {query.admin_remarks}
                      </p>
                    </>
                  ) : (
                    <div className="ml-1 text-sm text-slate-400">
                      No reply given till now...
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="mt-5 flex items-center gap-2">
              <input
                type="text"
                placeholder="Having doubts? Ask here..."
                className="input input-bordered w-full"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <button className="btn" onClick={sendRemarks}>
                <BiSend size={20} />
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt">
                Clicking on send button will replace your current remarks with
                new remarks (if any). If you haven&apos;t got any reply within a
                week, you can
                <a className="text-sky-600 underline"> click here</a> to contact
                us.
              </span>
            </label>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default QAModal;
