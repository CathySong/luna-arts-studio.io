# Google Form 注册系统设置指南

## 📋 已完成的功能

### **已添加的注册按钮位置：**
1. **首页顶部** - SummerCampHero组件中的红色"Register Now"按钮
2. **Camp部分顶部** - 大型红色"Register Now for Summer Camp"按钮
3. **每个Camp卡片** - 小型红色"Register"按钮
4. **折扣部分底部** - "Register Now → Google Form"按钮

### **技术实现：**
- ✅ 所有按钮链接到Google Form
- ✅ 在新标签页中打开(`target="_blank"`)
- ✅ 使用配置中心化管理链接
- ✅ 响应式设计适配所有设备

## 🔗 如何设置实际的Google Form链接

### **步骤1：创建Google Form**
1. 访问 [Google Forms](https://forms.google.com)
2. 点击"+"创建新表单
3. 设置表单标题："Luna Art Studio Summer Camp 2026 Registration"
4. 添加必要的字段：
   - 学生姓名
   - 家长姓名
   - 联系电话
   - 电子邮件
   - 学生年龄
   - 选择的营类型（半天上午/半天下午/全天）
   - 期望的日期/周数
   - 饮食要求/过敏信息
   - 紧急联系人信息

### **步骤2：获取表单链接**
1. 点击表单右上角的"发送"按钮
2. 选择"链接"图标
3. 复制生成的URL
4. 示例格式：`https://docs.google.com/forms/d/e/1FAIpQLSfYOUR-ACTUAL-FORM-ID/viewform`

### **步骤3：更新网站配置**
打开文件：`/config/summer-camp.ts`

```typescript
// 更新这一行：
registrationFormUrl: "https://docs.google.com/forms/d/e/YOUR-ACTUAL-FORM-ID/viewform",
```

### **步骤4：测试链接**
1. 提交更改到GitHub
2. 等待Vercel部署完成
3. 访问网站测试所有注册按钮
4. 确保表单可以正常提交

## 🎯 表单字段建议

### **必填字段：**
1. **学生信息**
   - 全名
   - 出生日期/年龄
   - 年级

2. **家长/监护人信息**
   - 全名
   - 与学生的关系
   - 联系电话
   - 电子邮件
   - 备用联系电话

3. **营选择**
   - 营类型（下拉菜单：半天上午/半天下午/全天）
   - 期望的开始日期
   - 报名周数
   - 是否有朋友一起报名（推荐折扣）

4. **健康与安全**
   - 过敏信息
   - 医疗状况
   - 药物需求
   - 饮食限制
   - 紧急医疗授权

5. **付款信息**
   - 了解折扣政策
   - 付款方式偏好
   - 发票需求

### **可选字段：**
- 学生艺术经验
- 特殊兴趣或需求
- 如何了解到我们的营
- 其他评论或问题

## 📊 表单设置最佳实践

### **1. 逻辑分支**
- 根据营类型显示不同的后续问题
- 全天营显示午餐选项
- 多周报名显示折扣信息

### **2. 确认页面**
- 设置自定义确认消息
- 包含下一步说明
- 提供联系信息

### **3. 响应收集**
- 启用电子邮件通知
- 设置Google Sheets集成
- 定期导出数据备份

## 🔧 技术配置说明

### **当前配置文件：**
```typescript
// config/summer-camp.ts
export const summerCampConfig = {
  registrationFormUrl: "https://docs.google.com/forms/d/e/YOUR-FORM-ID/viewform",
  // ... 其他配置
};
```

### **如何更新：**
1. 获取实际的Google Form URL
2. 替换配置文件中的示例URL
3. 提交更改：`git add . && git commit -m "更新Google Form链接" && git push`
4. Vercel会自动部署更新

### **多环境支持（可选）：**
如果需要测试环境和生产环境：
```typescript
const isProduction = process.env.NODE_ENV === 'production';
export const summerCampConfig = {
  registrationFormUrl: isProduction 
    ? "https://docs.google.com/forms/d/e/PRODUCTION-FORM-ID/viewform"
    : "https://docs.google.com/forms/d/e/TEST-FORM-ID/viewform",
};
```

## 📈 跟踪与分析

### **Google Analytics集成：**
在表单URL中添加UTM参数：
```typescript
registrationFormUrl: "https://docs.google.com/forms/d/e/FORM-ID/viewform?utm_source=website&utm_medium=button&utm_campaign=summer_camp_2026",
```

### **按钮点击跟踪：**
考虑添加简单的事件跟踪：
```typescript
const handleRegistrationClick = () => {
  // 可以在这里添加分析代码
  window.open(summerCampConfig.registrationFormUrl, '_blank');
};
```

## 🚀 部署检查清单

### **部署前：**
- [ ] Google Form已创建并测试
- [ ] 表单URL已复制
- [ ] 配置文件已更新
- [ ] 本地测试通过

### **部署后：**
- [ ] 网站已重新部署
- [ ] 所有按钮功能正常
- [ ] 表单在新标签页打开
- [ ] 移动端显示正常
- [ ] 表单提交成功

## 💡 高级功能建议

### **1. 表单预填充**
可以在URL中添加预填充参数：
```
https://docs.google.com/forms/d/e/FORM-ID/viewform?entry.1234567890=value
```

### **2. 多语言支持**
如果有多语言需求，可以创建不同语言的表单版本。

### **3. 季节性切换**
在配置中添加季节性开关，方便切换不同时期的注册表单。

## 🆘 故障排除

### **常见问题：**
1. **按钮不工作**
   - 检查URL格式是否正确
   - 确认`target="_blank"`属性存在
   - 测试链接是否有效

2. **表单无法提交**
   - 检查Google Form设置
   - 确认所有必填字段已设置
   - 测试表单提交流程

3. **移动端问题**
   - 测试响应式布局
   - 检查触摸目标大小
   - 验证移动端浏览器兼容性

### **支持：**
如有问题，请检查：
- 浏览器控制台错误
- Vercel部署日志
- Google Form设置

---

**重要提示**：请尽快创建实际的Google Form并更新配置文件中的链接，当前使用的是示例链接。