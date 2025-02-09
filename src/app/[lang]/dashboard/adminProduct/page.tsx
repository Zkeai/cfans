/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as echarts from "echarts";
import {
  Form,
  Row,
  Col,
  Button,
  Table,
  Toast,
  Card,
  Space,
  Modal,
} from "@douyinfe/semi-ui";
import React, { useEffect, useRef, useState } from "react";

type Product = {
  _id: string;
  service: string;
  name: string;
  min: number;
  max: number;
  category: string;
  rate: number;
  context?: string;
};

const AdminProduct = () => {
  const { Section, Input, InputNumber, TextArea } = Form;
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesId, setServicesId] = useState(0);
  const [dataSource, setDataSource] = useState<Product[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const categoryChartRef = useRef(null);

  const pageSize = 5;
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
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Space>
            <Button
              onClick={() => handleEdit(record)}
              type="primary"
              style={{ marginRight: 8 }}
            >
              修改
            </Button>
            <Button onClick={() => handleDelete(record._id)} type="danger">
              删除
            </Button>
          </Space>
        </>
      ),
    },
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

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/deleteProduct`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productId),
      });
      const result = await res.json();

      if (result.success) {
        Toast.success(result.message);
        getProduct(); // Refresh the product list after deletion
      } else {
        Toast.error(result.message);
      }
    } catch (error) {
      Toast.error("删除失败，请重试");
    }
  };

  useEffect(() => {
    getProduct();
  }, [servicesId]);

  useEffect(() => {
    // 分类统计
    const categoryCountMap: { [key: string]: number } = {};
    dataSource.forEach((product) => {
      const category = product.category;
      categoryCountMap[category] = (categoryCountMap[category] || 0) + 1;
    });

    // 绘制商品分类玫瑰图
    if (categoryChartRef.current) {
      const categoryChart = echarts.init(categoryChartRef.current);
      categoryChart.setOption({
        title: {
          text: "商品分类分布",
          left: "center",
        },
        tooltip: { trigger: "item" },
        legend: {
          bottom: "0%",
          textStyle: { color: "#fc8800" },
        },

        series: [
          {
            name: "商品分类",
            type: "pie",
            radius: ["40%", "70%"],
            roseType: "area",
            label: {
              show: true,
              textStyle: { color: "#42b983" },
            },
            data: Object.keys(categoryCountMap).map((key) => ({
              value: categoryCountMap[key],
              name: key,
            })),
          },
        ],
      });

      return () => categoryChart.dispose();
    }
  }, [dataSource]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalVisible(true);
  };
  const handleEditSubmit = async (values: any) => {
    try {
      const res = await fetch(`/api/updateProduct`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingProduct, ...values }),
      });

      const result = await res.json();
      if (result.success) {
        Toast.success(result.message);
        getProduct();
        setIsEditModalVisible(false);
      } else {
        Toast.error(result.message);
      }
    } catch (error) {
      Toast.error("修改失败，请重试");
    }
  };

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
    } catch (error) {
      Toast.error("未知错误");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 商品分类玫瑰图 */}
      <Card title="商品分类统计" className="p-4">
        <div
          style={{ width: "90%", height: 500, alignItems: "center" }}
          ref={categoryChartRef}
        />
      </Card>

      <Card className="p-4">
        <Form onSubmit={handleSubmit}>
          <Section text={"添加商品"}>
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
                  label="价格(千个)"
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
      </Card>
      {/* 编辑商品 Modal */}
      <Modal
        title="编辑商品"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        {editingProduct && (
          <Form
            onSubmit={handleEditSubmit}
            initValues={editingProduct}
            className="pb-8"
          >
            <Input field="name" label="名称" />
            <Input field="category" label="分类" />
            <InputNumber field="min" label="最小数量" />
            <InputNumber field="max" label="最大数量" />
            <Input field="rate" label="价格(千个)" />
            <TextArea field="context" label="简介" />
            <Button htmlType="submit" type="primary">
              保存修改
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminProduct;
