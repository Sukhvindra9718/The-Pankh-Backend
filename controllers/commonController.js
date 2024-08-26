const pool = require("../db");
const uuid = require("uuid");

// Contact Us Form
const registerContactUs = async (req, res) => {
  try {
    const { Name, Email, Phone, Subject, Message } = req.body;
    const id = uuid.v4();

    await pool.query(
      "INSERT INTO contactus (id, name, email, phone, subject, message, createdat) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *",
      [id, Name, Email, Phone, Subject, Message, new Date()]
    );
    res.status(201).json({
      success: true,
      msg: "Thank you for contacting us. We will get back to you soon.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getAllContactUs = async (req, res) => {
  try {
    console.log("get all contact us");
    const [rows] = await pool.query("SELECT * FROM contactus");
    res.status(200).json({ success: true, contacts: rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getContactUsById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM contactus WHERE id = ?", [id]);
    res.status(200).json({ success: true, contact: rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const deleteContactUs = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM contactus WHERE id = ?", [id]);
    res
      .status(200)
      .json({ success: true, msg: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getAllContactUsCount = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM contactus");
    res.status(200).json({
      success: true,
      tableName: "Contact Us",
      count: rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Contactus fetch failed",
    });
  }
};

// Key Contact Form
const addKeyContact = async (req, res) => {
  try {
    const { name, email, phone, organization, designation } = req.body;
    const id = uuid.v4();
    await pool.query(
      "INSERT INTO keycontact (id, name, email, phone, organization, designation) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
      [id, name, email, phone, organization, designation]
    );
    res.status(201).json({
      success: true,
      msg: "Key Contact added successfully.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getAllKeyContact = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM keycontact");
    res.status(200).json({ success: true, keyContacts: rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getKeyContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM keycontact WHERE id = ?", [id]);
    res.status(200).json({ success: true, keyContact: rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const deleteKeyContact = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM keycontact WHERE id = ?", [id]);
    res
      .status(200)
      .json({ success: true, msg: "Key Contact deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const updateKeyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, organization, designation } = req.body;
    const [rows] = await pool.query("SELECT * FROM keycontact WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, userError: "Key Contact not found" });
    }
    await pool.query(
      "UPDATE keycontact SET name = ?, email = ?, phone = ?, organization = ?, designation = ? WHERE id = ?",
      [name, email, phone, organization, designation, id]
    );
    res
      .status(200)
      .json({ success: true, msg: "Key Contact updated successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getAllkeyContactCount = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM keycontact");
    res.status(200).json({
      success: true,
      tableName: "Key Contacts",
      count: rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Key contact fetch failed",
    });
  }
};

// Properties Access Controllers
const addPropertiesAccess = async (req, res) => {
  try {
    const { id, Property, isEnabled } = req.body;
    await pool.query(
      "INSERT INTO propertiesaccess (id, Property, isEnabled) VALUES (?, ?, ?)",
      [id, Property, isEnabled]
    );
    res
      .status(201)
      .json({ success: true, msg: "Property access added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

const UpdatePropertiesAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { Property, isEnabled } = req.body;
    const [rows] = await pool.query("SELECT * FROM propertiesaccess WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Properties access not found" });
    }
    await pool.query(
      "UPDATE propertiesaccess SET Property = ?, isEnabled = ? WHERE id = ?",
      [Property, isEnabled, id]
    );
    res
      .status(200)
      .json({ success: true, msg: "Properties access updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

const getAllPropertiesAccess = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM propertiesaccess");
    res
      .status(200)
      .json({ success: true, PropertiesAccess: rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const getPropertiesAccessById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM propertiesaccess WHERE id = ?", [id]);
    res
      .status(200)
      .json({ success: true, PropertiesAccess: rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
const deletePropertiesAccess = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM propertiesaccess WHERE id = ?", [id]);
    res
      .status(200)
      .json({ success: true, msg: "Properties Access deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      userError: "Server Error",
      error: error.message,
    });
  }
};

const getAllTableRowCount = async (req, res) => {
  try {
    let data = [];

    const propertiesAccess = await pool.query("SELECT COUNT(*) AS count FROM propertiesaccess");
    data.push({ tableName: "Properties Access", count: propertiesAccess[0][0].count });

    const keyContact = await pool.query("SELECT COUNT(*) AS count FROM keycontact");
    data.push({ tableName: "Key Contacts", count: keyContact[0][0].count });

    const contactUs = await pool.query("SELECT COUNT(*) AS count FROM contactus");
    data.push({ tableName: "Contact Us", count: contactUs[0][0].count });

    const bankDetails = await pool.query("SELECT COUNT(*) AS count FROM bankdetails");
    data.push({ tableName: "Bank Details", count: bankDetails[0][0].count });

    const fund = await pool.query("SELECT COUNT(*) AS count FROM fund");
    data.push({ tableName: "Fund", count: fund[0][0].count });

    const banner = await pool.query("SELECT COUNT(*) AS count FROM banner");
    data.push({ tableName: "Banner", count: banner[0][0].count });

    const user = await pool.query("SELECT COUNT(*) AS count FROM users");
    data.push({ tableName: "Users", count: user[0][0].count });

    const carousal = await pool.query("SELECT COUNT(*) AS count FROM carousal");
    data.push({ tableName: "Carousal", count: carousal[0][0].count });

    const events = await pool.query("SELECT COUNT(*) AS count FROM events");
    data.push({ tableName: "Events", count: events[0][0].count });

    const news = await pool.query("SELECT COUNT(*) AS count FROM news");
    data.push({ tableName: "News", count: news[0][0].count });

    const project = await pool.query("SELECT COUNT(*) AS count FROM projects");
    data.push({ tableName: "Projects", count: project[0][0].count });

    const testimonial = await pool.query("SELECT COUNT(*) AS count FROM testimonial");
    data.push({ tableName: "Testimonials", count: testimonial[0][0].count });

    const volunteer = await pool.query("SELECT COUNT(*) AS count FROM volunteer");
    data.push({ tableName: "Volunteers", count: volunteer[0][0].count });

    const donation = await pool.query("SELECT COUNT(*) AS count FROM donations");
    data.push({ tableName: "Donations", count: donation[0][0].count });

    const image = await pool.query("SELECT COUNT(*) AS count FROM images");
    data.push({ tableName: "Images", count: image[0][0].count });

    const video = await pool.query("SELECT COUNT(*) AS count FROM videos");
    data.push({ tableName: "Videos", count: video[0][0].count });

    res.status(200).json({
      success: true,
      result: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Table count row fetch failed",
    });
  }
};


module.exports = {
  registerContactUs,
  getAllContactUs,
  getContactUsById,
  deleteContactUs,
  addKeyContact,
  getAllContactUsCount,
  getAllKeyContact,
  getKeyContactById,
  deleteKeyContact,
  updateKeyContact,
  getAllkeyContactCount,
  addPropertiesAccess,
  UpdatePropertiesAccess,
  getAllPropertiesAccess,
  getPropertiesAccessById,
  deletePropertiesAccess,
  getAllTableRowCount,
};
