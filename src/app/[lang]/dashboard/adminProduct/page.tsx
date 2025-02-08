"use client";
import { Form, Row, Col, Button, Table, Toast } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";

const AdminProduct = () => {
  const { Section, Input, InputNumber, TextArea } = Form;
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesId, setServicesId] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const pageSize = 5; // 每页显示 5 条数据

  const total = dataSource.length;
  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Min", dataIndex: "min", key: "min" },
    { title: "Max", dataIndex: "max", key: "max" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Context", dataIndex: "context", key: "context" },
  ];
  const style = { width: "90%" };

  const getProduct = async () => {
    const data = await fetch("/api/getProduct");
    const productList = await data.json();

    if (productList.success) {
      setDataSource(productList.message);
      if (productList.message.length === 0) {
        setServicesId(1001);
      } else {
        const maxService = Math.max(
          ...productList.message.map((item: { service: any }) =>
            Number(item.service)
          )
        );
        setServicesId(maxService + 1);
      }
    }
  };
  useEffect(() => {
    getProduct();
  }, [servicesId]);

  const handleSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (result.success) {
        Toast.success(result.message);
        getProduct();
      } else {
        Toast.error(result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Toast.error("未知错误");
    }
  };
  return (
    <div className="gap-6 p-6">
      <Form onSubmit={handleSubmit}>
        <Section text={"商品信息"}>
          <Row>
            <Col span={12}>
              <Input
                field="name"
                label="名称"
                placeholder="请填写商品名称"
                style={style}
                trigger="blur"
              />
            </Col>
            <Col span={12}>
              <Input
                field="category"
                placeholder="请填写商品分类"
                label="分类"
                style={style}
                trigger="blur"
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <InputNumber
                field="min"
                label="最小数量"
                initValue={1}
                style={style}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                field="max"
                label="最大数量"
                initValue={99999}
                style={style}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <TextArea
                style={{ ...style, height: 120 }}
                field="context"
                label="简介"
                placeholder="请填写商品简介"
              />
            </Col>
            <Col span={12}>
              <Input
                field="rate"
                placeholder="每千个价格"
                label="价格"
                style={style}
                trigger="blur"
              />
              <Row>
                <Col span={12}>
                  <Input
                    key={servicesId}
                    field="service"
                    placeholder="系统自动绑定 ID"
                    initValue={servicesId} // 确保 Input 绑定 servicesId
                    label="商品ID"
                    style={style}
                    trigger="blur"
                  />
                </Col>

                <Col span={12} style={{ marginTop: "36px", width: "50px" }}>
                  <Button style={{ width: "15.4rem" }} htmlType="submit">
                    添加
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Section>

        <Section text={"商品列表"}>
          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={{
              total,
              pageSize,
              currentPage,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Section>
      </Form>
    </div>
  );
};

export default AdminProduct;
