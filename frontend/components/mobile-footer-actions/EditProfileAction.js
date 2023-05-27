const EditProfileAction = ({ handleSubmit, onSubmit, setShowEditProfile }) => {
  return (
    <section className="fixed bottom-[54px] z-20 w-full bg-neutral-content px-4 pt-4 pb-6">
      <div className="flex items-center justify-around">
        <div>
          <button
            className="btn btn-outline"
            onClick={() => setShowEditProfile(false)}
          >
            Cancel
          </button>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditProfileAction;
