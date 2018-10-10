import React, { Component } from 'react'
import { Link } from "@reach/router" 
import Card from "../../reactLIB/Card";

class NotFound extends Component {
  render() {
    return (
      <div className='paperOut'>
        <Card className='paperIn'>
          404 Error !!
          <br/>
          <br/>
          <Link to='/'>Home</Link>
        </Card>
      </div>
    )
  }
}

export default NotFound
