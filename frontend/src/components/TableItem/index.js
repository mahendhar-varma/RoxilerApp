import "./index.css";

const TableItem = (props) => {
  const { data } = props;
  console.log(data);
  const { id, title, description, price, category, image } = data;

  let { sold } = data;
  if (sold === 1) {
    sold = "True";
  } else {
    sold = "False";
  }
  return (
    <tr className="tableRow">
      <td className="td">{id}</td>
      <td className="titleText td">{title}</td>
      <td className="texts td">{description}</td>
      <td className="td">{price}</td>
      <td className="td">{category}</td>
      <td className="td">{sold}</td>
      <td className="td">
        <img src={image} alt="product" className="image" />
      </td>
    </tr>
  );
};

export default TableItem;
