import React, {useState, useEffect} from "react";
import api from './api'

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormdata] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });
  const fetchTransactions = async () => {
    const reponse = await api.get('/transactions/');
    setTransactions(reponse.data)  //transactions 데이터 저장 -> 이후 렌더링시 사용할수 있음
  };

  useEffect(()=> {
    fetchTransactions();
  }, []);  //처음 랜더링될때만 실행됨 -> useeffec가 실행되면 fetchtrans..가 호출되어 api요청보내고 데이터 저장함

  const handleInputChange = (event) => { //form 입력데이터 변경시 처리 함수
    const value = event.target.type === 'checkbox'? event.target.checked : event.target.value; //체크박스 타입이면 체크여부, 아니면 입력값
    setFormdata({...formData,      //이전값 유지
      [event.target.name]: value, // 계산된 속성명 문법으로, 입력 필드의 name 속성에 따라 동적으로 키를 할당함.-> 폼상태를 최신상태로 유지함
    });
    }  
  
  const handleFormSubmit = async (event) => {
    event.preventDefault(); //폼의 기본동작인 페이지 새로고침을 방지함.
    await api.post('/transactions/', formData);
    fetchTransactions();
    setFormdata({   //post후 입력값 form 입력값 초기화함
      amount: '',
      category: '',
      description: '',
      is_income: false,
      date: ''
    })
  }


  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href='/'>
            Finance
          </a>
        </div>
      </nav>
      <div className="container">
        <form onSubmit={handleFormSubmit}>

          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input type="text" className='form-control' id='amount' name='amount' onChange={handleInputChange} value={formData.amount}/>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="category" className="form-label">
              category
            </label>
            <input type="text" className='form-control' id='category' name='category' onChange={handleInputChange} value={formData.category}/>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input type="text" className='form-control' id='description' name='description' onChange={handleInputChange} value={formData.description}/>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="is_income" className="form-label">
              income
            </label>
            <input type="checkbox"  id='is_income' name='is_income' onChange={handleInputChange} value={formData.is_income}/>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="date" className="form-label">
              date
            </label>
            <input type="text" className='form-control' id='date' name='date' onChange={handleInputChange} value={formData.date}/>
          </div>

          <button type='submit' className="btn btn-primary">
            Sumbit
          </button>

        </form>

        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Amount</th>
              <th>category</th>
              <th>Description</th>
              <th>Income?</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? "Yes" : "No"}</td>
                <td>{transaction.date}</td>
              </tr>
            )) }
          </tbody>
        </table>


      </div>
    </div>
  )


}


export default App;
