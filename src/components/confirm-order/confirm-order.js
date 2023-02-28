import React, { useContext } from 'react'
import Summary from '../summary/summary'
import Agreement from './agreement'
import { Button, Divider } from 'antd'
import { CaretLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { AppContext } from '../../shared/contexts/app.context'

const ConfirmOrder = () => {
	const {
		current,
		next,
		prev,
		userEmail,
		agreement1,
		agreement2
	} = useContext(AppContext)

	return (
		<React.Fragment>
			<Agreement />
			{/* <Button type="primary" id="btn-checkout" style={{ marginTop: 30, float: "right" }} onClick={next} disabled={!agreement1 }><ShoppingCartOutlined /> Checkout</Button>
			<Button type="primary" style={{ marginTop: 30 }} onClick={prev}><CaretLeftOutlined /> Go back shopping</Button> */}
		</React.Fragment>
	)
}

export default ConfirmOrder