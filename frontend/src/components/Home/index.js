import { Component } from "react";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./index.css";
import TableItem from "../TableItem";

const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class Home extends Component {
  state = {
    pageNo: 1,
    search: "",
    selectValue: monthsList[2],
    month: 3,
    tableDataList: [],
    statsData: {},
    barChartList: [],
  };

  componentDidMount() {
    this.getRequiredData();
    this.getStatsData();
  }

  onMonthChange = () => {
    this.getRequiredData();
    this.getStatsData();
  };

  onFormSubmit = () => {
    this.getRequiredData();
  };

  getRequiredData = async () => {
    const { search, pageNo, month } = this.state;

    const apiUrl = `http://localhost:3001/home/?month=${month}&search=${search}&page_no=${pageNo}`;

    const options = {
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001/",
      },
    };

    try {
      const responseData = await axios.get(apiUrl, options);
      this.setState({ tableDataList: responseData.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  addSearchValue = (event) => {
    this.setState({ search: event.target.value });
  };

  changeSelectItem = (event) => {
    const inputValue = event.target.value;
    let month;
    switch (inputValue) {
      case monthsList[0]:
        month = 1;
        break;
      case monthsList[1]:
        month = 2;
        break;
      case monthsList[2]:
        month = 3;
        break;
      case monthsList[3]:
        month = 4;
        break;
      case monthsList[4]:
        month = 5;
        break;
      case monthsList[5]:
        month = 6;
        break;
      case monthsList[6]:
        month = 7;
        break;
      case monthsList[7]:
        month = 8;
        break;
      case monthsList[8]:
        month = 9;
        break;
      case monthsList[9]:
        month = 10;
        break;
      case monthsList[10]:
        month = 11;
        break;
      case monthsList[11]:
        month = 12;
        break;
      default:
        month = 3;
    }
    this.setState(
      { selectValue: event.target.value, month: month },
      this.onMonthChange
    );
  };

  loadNextPage = () => {
    this.setState(
      (prevState) => ({
        pageNo: prevState.pageNo + 1,
      }),
      this.getRequiredData
    );
  };

  loadPrevPage = () => {
    const { pageNo } = this.state;
    if (pageNo > 1) {
      this.setState(
        (prevState) => ({
          pageNo: prevState.pageNo - 1,
        }),
        this.getRequiredData
      );
    }
  };

  getStatsData = async () => {
    const { month } = this.state;
    const apiUrl = `http://localhost:3001/home/response/?month=${month}`;

    const options = {
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001/",
      },
    };

    try {
      const responseData = await axios.get(apiUrl, options);
      const data = responseData.data;
      this.setState({
        statsData: data.statistics,
        barChartList: data.priceRange,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  render() {
    const {
      selectValue,
      pageNo,
      statsData,
      barChartList,
      tableDataList,
    } = this.state;
    const { totalPrice, totalNotSoldItems, totalSoldItems } = statsData;

    const check = tableDataList.length !== 0;

    return (
      <div className="mainContainer">
        <div className="titleContainer">
          <p className="title">Transaction Dashboard</p>
        </div>
        <div>
          <div className="responseChangeContainer">
            <form className="form" onSubmit={this.changeSelectItem}>
              <input
                type="text"
                id="title"
                className="inputElement"
                placeholder="Search transaction"
                onChange={this.addSearchValue}
              />
              <button type="submit" className="searchButton">
                <BiSearch className="searchIcon" />
              </button>
            </form>
            <select
              className="selectElement"
              onChange={this.changeSelectItem}
              value={selectValue}
            >
              {monthsList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <table border="1" className="table">
            <tbody>
              <tr className="tableRow">
                <th className="tableHead">ID</th>
                <th className="tableHead">Title</th>
                <th className="tableHead">Description</th>
                <th className="tableHead">Price</th>
                <th className="tableHead">Category</th>
                <th className="tableHead">Sold</th>
                <th className="tableHead">Image</th>
              </tr>
              {check &&
                tableDataList.map((item) => (
                  <TableItem data={item} key={item.id} />
                ))}
            </tbody>
          </table>

          <div className="responseChangeContainer">
            <p className="text">Page: {pageNo}</p>
            <>
              <button
                type="button"
                className="searchButton btn text"
                onClick={this.loadNextPage}
              >
                Next
              </button>
              <p>-</p>
              <button
                type="button"
                className="searchButton btn text"
                onClick={this.loadPrevPage}
              >
                Previous
              </button>
            </>
            <p className="text">Per Page: 10</p>
          </div>
        </div>

        <div className="statsContainer">
          <h1 className="head">
            Statistics - {selectValue}
            <span>(selected month name from dropdown)</span>
          </h1>
          <div className="statsDataContainer">
            <div className="labelContainer">
              <p className="statText">Total Sale </p>
              <p className="statText">{totalPrice}</p>
            </div>
            <div className="labelContainer">
              <p className="statText">Total Sold Item </p>
              <p className="statText">{totalSoldItems}</p>
            </div>
            <div className="labelContainer">
              <p className="statText">Total not Sold Item </p>
              <p className="statText">{totalNotSoldItems}</p>
            </div>
          </div>
        </div>
        <div className="statsContainer">
          <h1 className="head">
            Bar Chart Stats - {selectValue}
            <span>(selected month name from dropdown)</span>
          </h1>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartList} margin={{ top: 5 }}>
              <XAxis
                dataKey="priceRange"
                tick={{ stroke: "gray", strokewidth: 1 }}
              />
              <YAxis tick={{ stroke: "gray", strokewidth: 0 }} />
              <Legend wrapperStyle={{ padding: 20 }} />
              <Bar
                dataKey="totalPriceRangeItems"
                name="Price range"
                fill="#1f77b4"
                barSize="15%"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default Home;
