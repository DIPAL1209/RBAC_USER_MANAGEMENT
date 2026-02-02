const { fn, col, where } = require("sequelize");

const applyDateFilter = (query) => {
  if (!query.date) return null;

  let date = query.date;

  if (date.includes("/")) {
    date = date.replace(/\//g, "-");
  }

  if (/^\d{1,2}$/.test(date)) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(date).padStart(2, "0");
    date = `${y}-${m}-${d}`;
  }

 const dateField = query.dateField || "created_at";
  
  const allowedDateFields = ["created_at", "updated_at", "joining_date"];
  const actualDateField = allowedDateFields.includes(dateField) 
    ? dateField 
    : "created_at";

  return where(fn("DATE", col(`User.${actualDateField}`)), date);
};

module.exports = applyDateFilter;
