// commonController.js

const pool = require("../db");
const uuid = require("uuid");

const createContactUsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contactus (
      id UUID PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR NOT NULL,
      subject VARCHAR NOT NULL,
      message TEXT NOT NULL,
      createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'contactus' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
// Contact Us Form
const registerContactUs = async (req, res) => {
  try {
    // File upload
    const { Name, Email, Phone, Subject, Message } = req.body;
    let id = uuid.v4();

    await pool.query(
      "INSERT INTO contactus (id,name,email,phone,subject,message,createdat) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
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
  createContactUsTable();
  try {
    console.log("get all contact us");
    const allContactUs = await pool.query("SELECT * FROM contactus");
    res.status(200).json({ success: true, contacts: allContactUs.rows });
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
    const contact = await pool.query("SELECT * FROM contactus WHERE id = $1", [
      id,
    ]);
    res.status(200).json({ success: true, contact: contact.rows });
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
    await pool.query("DELETE FROM contactus WHERE id = $1", [id]);
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
    const contactus = await pool.query("SELECT count(*) FROM contactus");
    res.status(200).json({
      success: true,
      tableName: "Contact Us",
      count: contactus.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "Contactus fetch failed",
    });
  }
};

const createKeyContactTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS keycontact (
      id UUID PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR NOT NULL,
      organization VARCHAR NOT NULL,
      designation VARCHAR NOT NULL
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'keycontact' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
// Key Contact Form

const addKeyContact = async (req, res) => {
  try {
    const { name, email, phone, organization, designation } = req.body;
    let id = uuid.v4();
    await pool.query(
      "INSERT INTO keycontact (id,name,email,phone,organization,designation) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *",
      [id, name, email, phone, organization, designation]
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

const getAllKeyContact = async (req, res) => {
  createKeyContactTable();
  try {
    const allKeyContact = await pool.query("SELECT * FROM keycontact");
    res.status(200).json({ success: true, keyContacts: allKeyContact.rows });
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
    const keyContact = await pool.query(
      "SELECT * FROM keycontact WHERE id = $1",
      [id]
    );
    res.status(200).json({ success: true, keyContact: keyContact.rows });
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
    await pool.query("DELETE FROM keycontact WHERE id = $1", [id]);
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
    const keyContact = await pool.query(
      "SELECT * FROM keycontact WHERE id = $1",
      [id]
    );
    if (keyContact.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, userError: "Key Contact not found" });
    }
    await pool.query(
      "UPDATE keycontact SET name = $1, email = $2, phone = $3, organization = $4, designation = $5 WHERE id = $6",
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
    const keycontact = await pool.query("SELECT count(*) FROM keycontact");
    res.status(200).json({
      success: true,
      tableName: "Key Contacts",
      count: keycontact.rows[0].count,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      userError: "keycontact fetch failed",
    });
  }
};

const createPropertiesAccessTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS propertiesaccess (
      id UUID PRIMARY KEY NOT NULL,
      Property VARCHAR NOT NULL,
      isEnabled BOOLEAN NOT NULL
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Table 'propertiesAccess' created successfully");
  } catch (err) {
    console.error("Error creating table", err.stack);
  } finally {
  }
};
const addPropertiesAccess = async (req, res) => {
  try {
    const { id, Property, isEnabled } = req.body;
    const addAccess = await pool.query(
      "INSERT INTO propertiesaccess (id,Property,isEnabled) VALUES ($1, $2, $3) RETURNING *",
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
    const id = req.params;
    const { Property, isEnabled } = req.body;
    const propertyAccess = await pool.query(
      "SELECT * FROM propertiesAccess WHERE id = $1",
      [id]
    );
    if (propertyAccess.rows.length === 0) {
      res
        .status(404)
        .json({ success: false, msg: "Properties access not found" });
    }
    await pool.query(
      "UPDATE propertiesAccess SET Property = $1, isEnabled = $2 WHERE id = $3",
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
  createPropertiesAccessTable();
  try {
    const allPropertiesAccess = await pool.query(
      "SELECT * FROM propertiesAccess"
    );
    res
      .status(200)
      .json({ success: true, PropertiesAccess: allPropertiesAccess.rows });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const getPropertiesAccessById = async (req, res) => {
  try {
    const id = req.params;
    const PropertyAccessByID = await pool.query(
      "SELECT * FROM propertiesAccess WHERE id = $1",
      [id]
    );
    res
      .status(200)
      .json({ success: true, PropertiesAccess: PropertyAccessByID.rows });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
const deletePropertiesAccess = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM propertiesAccess WHERE id = $1", [id]);
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
    // I want to get the count of all the rows of every table in my database in the format {tableName: 'tableName', count: count}
    let data = [];
    // const propertiesAccess = await pool.query(
    //   "SELECT count(*) FROM propertiesAccess"
    // );
    // data.push({
    //   tableName: "Properties Access",
    //   count: propertiesAccess.rows[0].count,
    // });
    const keycontact = await pool.query("SELECT count(*) FROM keycontact");
    data.push({ tableName: "Key Contacts", count: keycontact.rows[0].count });
    const contactus = await pool.query("SELECT count(*) FROM contactus");
    data.push({ tableName: "Contact Us", count: contactus.rows[0].count });
    const bankdetails = await pool.query("SELECT count(*) FROM bankdetails");
    data.push({ tableName: "Bank Details", count: bankdetails.rows[0].count });
    const fund = await pool.query("SELECT count(*) FROM fund");
    data.push({ tableName: "Fund", count: fund.rows[0].count });
    const banner = await pool.query("SELECT count(*) FROM banner");
    data.push({ tableName: "Banner", count: banner.rows[0].count });
    const user = await pool.query("SELECT count(*) FROM users");
    data.push({ tableName: "Users", count: user.rows[0].count });
    const carousal = await pool.query("SELECT count(*) FROM carousal");
    data.push({ tableName: "Carousal", count: carousal.rows[0].count });
    const events = await pool.query("SELECT count(*) FROM events");
    data.push({ tableName: "Events", count: events.rows[0].count });
    const news = await pool.query("SELECT count(*) FROM news");
    data.push({ tableName: "News", count: news.rows[0].count });
    const project = await pool.query("SELECT count(*) FROM projects");
    data.push({ tableName: "Projects", count: project.rows[0].count });
    const testimonial = await pool.query("SELECT count(*) FROM testimonial");
    data.push({ tableName: "Testimonials", count: testimonial.rows[0].count });
    const volunteer = await pool.query("SELECT count(*) FROM volunteer");
    data.push({ tableName: "Volunteers", count: volunteer.rows[0].count });
    const donation = await pool.query("SELECT count(*) FROM donations");
    data.push({ tableName: "Donations", count: donation.rows[0].count });
    const image = await pool.query("SELECT count(*) FROM images");
    data.push({ tableName: "Images", count: image.rows[0].count });
    const video = await pool.query("SELECT count(*) FROM videos");
    data.push({ tableName: "Videos", count: video.rows[0].count });

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
