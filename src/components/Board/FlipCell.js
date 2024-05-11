import styles from "./FlipCell.module.css";
function FlipCell({ value, style1, style2, flip, delay }) {
  return (
    <div className={`w-14 h-14 relative font-bold ${flip ? styles.flip : ""}`}>
      <div
        className={`${styles["flip-front"]} absolute inset-0 grid place-content-center`}
        style={{
          ...style1,
          backfaceVisibility: "hidden",
          transitionDelay: flip ? delay + "ms" : "",
        }}
      >
        {value}
      </div>
      <div
        className={`${styles["flip-back"]} absolute inset-0 grid place-content-center`}
        style={{
          ...style2,
          backfaceVisibility: "hidden",
          transitionDelay: flip ? delay + "ms" : "",
        }}
      >
        {value}
      </div>
    </div>
  );
}
export default FlipCell;