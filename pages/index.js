import BasicTree from "../components/tree";

const Homepage = () => {
  return (
    <div className="mt-20">
      <div>
        <small className="uppercase">Directory:</small>
        <BasicTree />
      </div>
      <div>
        <small className="uppercase">Relative Path:</small>
      </div>
    </div>
  );
}

export default Homepage;
