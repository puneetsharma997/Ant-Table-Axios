import React, { useEffect, useState } from 'react'
import './AntTable.scss';
import 'antd/dist/antd.min.css'
import { Dropdown, Menu, Table } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import Column from "antd/lib/table/Column";
import data from './data';
import { handleSort } from './functions';
import { DropDown } from './Dropdown';
import axios from 'axios';


const AntTable = () => {

    const [attribute, setAttribute] = useState('');
    const [selectedRows, setSelectedRows] = useState([])
    const [oldData, setData] = useState([])
    const [active, setActive] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)

    const items = [
        { key: '1', label: 'Ascending' },
        { key: '2', label: 'Descending' },
    ]

    const fetchData = async (currentPage) => {
        const res = await axios.get(`http://localhost:4000/rubick?page=${currentPage}`);
        setData(res.data.productResults);
        setTotalPage(res.data.totalpage)
        // console.log(res.data)

        let activeStatus = 0;
        res.data.productResults.map((item) => {
            if (item.status === 'active') {
                activeStatus++
            }
        })
        setActive(activeStatus)
    }

    useEffect(() => {
        fetchData(currentPage);
    }, [])

    const deleteHandler = () => {
        axios.delete('http://localhost:4000/rubick/delete', { data: { keys: selectedRows } }).then((res) => {
            setData([...res.data])
        }).catch((e) => {
            return []
        })
        setSelectedRows([])
    }

    const onClearRowSelection = () => {
        setSelectedRows([])
    }

    const handleChange = (event) => {
        setCurrentPage(event.current)
        fetchData(event.current)
        setSelectedRows([])
    }

    return (
        <div className='main-wrapper'>

            <div className='table-header'>
                <span>Scrapes</span>
                <span> {active} Active</span>
                <span> | </span>
                <span>{oldData.length - active} Inactive</span>
            </div>

            <div className='table-wrapper'>
                <Table
                    pagination={{
                        current: currentPage,
                        total: totalPage * 10
                    }
                    }
                    dataSource={oldData}
                    onChange={handleChange}
                    rowSelection={{
                        typeTable: 'checkbox',
                        selectedRowKeys: selectedRows,
                        onChange: (selectedRowKeys) => {
                            setSelectedRows(selectedRowKeys)
                        },
                    }} >

                    <Column
                        title='Batch ID'
                        dataIndex='batchId'
                        key='key'
                        render={(text, record) => <a href={record.link} target='_blank' rel="noreferrer" > {text} </a>}
                    />

                    <Column
                        title={
                            <DropDown
                                title={'Family'}
                                dataName={'family'}
                                handleSort={handleSort}
                                setAttribute={setAttribute}
                                items={items}
                                oldData={oldData}
                                setData={setData}
                                attribute={attribute}
                            />
                        }
                        dataIndex='family'
                        key='key'
                        render={(text, record) => <>
                            <img alt='' src={`http://localhost:4000/${record.img}`} style={{ height: '30px', width: '30px', marginRight: '10px' }} />
                            <span> {text} </span>
                        </>}
                    />

                    <Column
                        title={
                            <DropDown
                                title={'Source'}
                                dataName={'source'}
                                handleSort={handleSort}
                                setAttribute={setAttribute}
                                items={items}
                                oldData={oldData}
                                setData={setData}
                                attribute={attribute}
                            />
                        }
                        dataIndex='source'
                        key='key'
                    />

                    <Column
                        title={
                            <DropDown
                                title={'Results'}
                                dataName={'results'}
                                handleSort={handleSort}
                                setAttribute={setAttribute}
                                items={items}
                                oldData={oldData}
                                setData={setData}
                                attribute={attribute}
                            />
                        }
                        dataIndex='results'
                        key='key'
                    />

                    <Column
                        title={
                            <DropDown
                                title={'Imported'}
                                dataName={'imported'}
                                handleSort={handleSort}
                                setAttribute={setAttribute}
                                items={items}
                                oldData={oldData}
                                setData={setData}
                                attribute={attribute}
                            />
                        }
                        dataIndex='imported'
                        key='key'
                    />

                    <Column
                        title='Last Updated'
                        dataIndex='lastUpdated'
                        key='key'
                    />

                    <Column
                        title={<span class="material-symbols-outlined">
format_list_bulleted
</span>}
                        dataIndex='action'
                        key='key'
                        render={() =>
                            <Dropdown overlay={<Menu items={[{ key: '1', label: 'View' }, { key: '2', label: 'Edit' }]} />}
                                trigger='click' >
                                <MoreOutlined />
                            </Dropdown>}
                    />

                </Table>
            </div>

            {selectedRows.length > 0 ?
                <div className="table-footer">
                    <div className="table-toolbar">{selectedRows.length} Row{selectedRows.length > 1 ? 's' : null} Selected</div>
                    <div className="table-toolbar">
                        <a className='clearRowSelection' onClick={() => onClearRowSelection(setSelectedRows)} >Clear Selection</a>
                        <a className='deleteRowSelection' onClick={() => deleteHandler(setData, oldData, selectedRows, setSelectedRows)} >
                            <span className='deleteRow'>Delete</span>
                        </a>
                    </div>
                </div>
                : null}
        </div>
    )
}

export default AntTable;
