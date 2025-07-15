const Map = () => {
  return (
    <div className="box xl:p-6">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14594.420868364632!2d90.38272851617783!3d23.86814853155446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1702450501605!5m2!1sen!2sbd"
        width="100%"
        height="450"
        style={{ border: 0 }}
        className="rounded-xl border border-n30 dark:border-n500"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
};

export default Map;
