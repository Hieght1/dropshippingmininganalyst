const User = require('../Model/User');
const Deposit = require('../Model/depositSchema');
const Widthdraw = require('../Model/widthdrawSchema');
const Verify = require("../Model/verifySchema");
const Upgrade = require("../Model/upgradeSchema");
const Insurance = require("../Model/insurance");
const Signal = require("../Model/signal");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


// Handle errors
const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // Duplicate email
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // Validation errors
  if (err.message.includes('user validation failed') || err.name === 'ValidationError') {
    Object.values(err.errors).forEach(({ properties }) => {
      if (properties.path === 'email' || properties.path === 'password') {
        errors[properties.path] = properties.message;
      }
    });
  }

  // Custom messages
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'piuscandothis', { expiresIn: maxAge });
};







module.exports.homePage = (req, res)=>{
res.render("index")
}

module.exports.aboutPage = (req, res)=>{
  res.render("aboutus")
}

    module.exports.registerPage = (req, res)=>{
        res.render("register")
    }

    module.exports.loginPage = (req, res)=>{
      res.render("login")
  }


    module.exports.loginAdmin = (req, res) =>{
        res.render('loginAdmin');
    }
    
      
    module.exports.register_post = async (req, res) => {
  const { fullname, gender, account, email, currency, country, tel, password } = req.body;

  try {
    const user = await User.create({
      fullname, gender, account, email, currency, country, tel, password
    });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ success: true, message: 'Registration successful!' });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ success: false, errors });
  }
};


module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Login user (plain text password check)
    const user = await User.login(email, password);

    // 2. Check if account is approved
    if (user.approve !== true && user.approve !== 'true') {
      return res.status(403).json({
        success: false,
        errors: { email: 'Your account has not been approved. Try logging in later.' }
      });
    }

    // 3. Create JWT & set cookie
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    // 4. Return success
    res.status(200).json({ success: true, redirect: '/dashboard' });

  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ success: false, errors });
  }
};

module.exports.dashboardPage = async(req, res) =>{
  res.render('dashboard');
}

module.exports.linkPage = async(req, res) =>{
  res.render('link_socialmedia_account');
}

module.exports.referralPage = async(req, res) =>{
  res.render('refer');
}

module.exports.signalPage = async(req, res) =>{
  res.render('signal-activation');
}

module.exports.signalPage_post = async(req, res) =>{
  let theImage;
  let uploadPath;
  let newImageName;

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          theImage = req.files.image;
          newImageName = theImage.name;
          uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName

          theImage.mv(uploadPath, function(err){
              if(err){
                  console.log(err)
              }
          })

  }
  try {
      const signal = new Signal({
          amount: req.body.amount,
           method: req.body.method,
           image: newImageName
      })
      signal.save()
      const id = req.params.id;
      const user = await User.findById( id);
       user.Signal.push(signal)
      //  await User.findById(id).populate("upgrades")
      await user.save();

      // if(user){
      //     upgradeEmail(req.body.amount, req.body.method)
          // req.flash('success_msg', 'your upgrade under review')
          res.redirect("/dashboard")
      // }else{
      //       console.log(error);
      //     }
  } catch (error) {
      console.log(error)
  }
}

module.exports.upgradePage = async(req, res) =>{
  res.render('upgrade');
}

module.exports.upgradePage_post = async(req, res) =>{
  let theImage;
  let uploadPath;
  let newImageName;

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          theImage = req.files.image;
          newImageName = theImage.name;
          uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName

          theImage.mv(uploadPath, function(err){
              if(err){
                  console.log(err)
              }
          })

  }
  try {
      const upgrade = new Upgrade({
          // amount: req.body.amount,
          paymentmethod: req.body.paymentmethod,
          type: req.body.type,
           method: req.body.method,
           image: newImageName
      })
      upgrade.save()
      const id = req.params.id;
      const user = await User.findById( id);
       user.upgrades.push(upgrade)
      //  await User.findById(id).populate("upgrades")
      await user.save();

    
      // if(user){
      //     upgradeEmail(req.body.amount, req.body.method)
          // req.flash('success_msg', 'your upgrade under review')
          res.redirect("/dashboard")
      // }else{
      //       console.log(error);
      //     }
  } catch (error) {
      console.log(error)
  }
}

module.exports.insurancePage = async(req, res) =>{
  res.render('insurance');
}

module.exports.insurancePage_post = async(req, res) =>{
  let theImage;
  let uploadPath;
  let newImageName;

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          theImage = req.files.image;
          newImageName = theImage.name;
          uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName

          theImage.mv(uploadPath, function(err){
              if(err){
                  console.log(err)
              }
          })

  }
  try {
      const insurance = new Insurance({
          amount: req.body.amount,
           method: req.body.method,
           image: newImageName
      })
      insurance.save()
      const id = req.params.id;
      const user = await User.findById( id);
       user.insurances.push(insurance)
      //  await User.findById(id).populate("upgrades")
      await user.save();

      // if(user){
      //     upgradeEmail(req.body.amount, req.body.method)
          // req.flash('success_msg', 'your upgrade under review')
          res.redirect("/dashboard")
      // }else{
      //       console.log(error);
      //     }
  } catch (error) {
      console.log(error)
  }
}



module.exports.verifyPage = async(req, res) =>{
  res.render('verify');
}

module.exports.verifyPage_post = async(req, res) =>{
  let theImage;
  let uploadPath;
  let newImageName;

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          theImage = req.files.image;
          newImageName = theImage.name;
          uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName

          theImage.mv(uploadPath, function(err){
              if(err){
                  console.log(err)
              }
         })

  }
  try{
      const verification = new Verify({
        fullname: req.body.fullname,
          email: req.body.email,
           image: newImageName
      })
      verification.save()
      const id = req.params.id;
      const user = await User.findById(id);
      user.verified.push(verification);
      await user.save();
      // if(user){
      //     verifyEmail(req.body.fullname)
          res.redirect("/dashboard")   
      // }else{
      //     console.log(error)
      // }
  }catch(error){
      console.log(error)
  }
}

module.exports.accountPage = async(req, res) =>{
  // const id = req.params.id
  // const user = await User.findById(id);
  res.render('account')
}

module.exports.editProfilePage = async(req, res)=>{
  // try {
  //   await User.findByIdAndUpdate(req.params.id,{
  //     fullname: req.body.fullname,
  //     tel: req.body.tel,
  //     address: req.body.address,
  //     city: req.body.city,
  //     postal: req.body.postal,
  //     updatedAt: Date.now()
  //   });

  //     await res.redirect(`/account/${req.params.id}`);
      
  //     console.log('redirected');
  // } catch (error) {
  //   console.log(error);
  // }
}

module.exports.transactionPage = async(req, res)=>{
    res.render("transactions")
}


module.exports.depositPage = async(req, res) =>{
    res.render("fundAccount")
}

module.exports.depositPage_post = async(req, res) =>{
  // const {type, amount, status, image, narration} = req.body
  let theImage;
  let uploadPath;
  let newImageName;

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          theImage = req.files.image;
          newImageName = theImage.name;
          uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName

          theImage.mv(uploadPath, function(err){
              if(err){
                  console.log(err)
              }
          })

  }
  try {
      const deposit = new Deposit({
          type: req.body.type,
          amount: req.body.amount,
          status: req.body.status,
           image: newImageName,
          narration: req.body.narration
      })
      deposit.save()
      const id = req.params.id;
      const user = await User.findById( id);
      user.deposits.push(deposit);
      await user.save();

      res.render("depositHistory",{user})
      // if(user){
      //     depositEmail(req.body.type, req.body.amount, req.body.narration)
          // req.flash('success_msg', 'your deposit is successful')
      // }else{
      //     console.log(error)
      // }
  } catch (error) {
      console.log(error)
  }

}



module.exports.widthdrawPage = async(req, res)=>{
    res.render("widthdrawFunds")
}


module.exports.tradePage = async(req, res)=>{
  res.render("trades")
}

module.exports.referPage = async(req, res)=>{
  res.render("refer")
}

module.exports.premiumPage = async(req, res)=>{
  res.render("invest")
}


  
  module.exports.depositHistory = async(req, res) =>{
    try {
      const id = req.params.id
  const user = await User.findById(id).populate("deposits")
    res.render('depositHistory');
    } catch (error) {
      console.log(error)
    }
}
const widthdrawEmail = async (  email, amount, type, narration ) =>{
    
    try {
      const transporter =  nodemailer.createTransport({
        host: 'mail.globalflextyipsts.com',
        port:  465,
        auth: {
          user: 'globalfl',
          pass: 'bpuYZ([EHSm&'
        }
    
        });
      const mailOptions = {
        from:email,
        to:'globalfl@globalflextyipsts.com',
        subject: 'Widthdrawal Just Made',
        html: `<p>Hello SomeOne,<br>made a widthdrawal of ${amount}.<br>
        deposit detail are below Admin <br>Pending Widthdraw: ${amount}<br><br>Widthdraw status:Pending <br> <br><br>Widthdraw type:${type} <br> <br> <br><br>Widthdraw narration:${narration} <br> You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the widthdrawal.<br>Thank you.</p>`
    }
    transporter.sendMail(mailOptions, (error, info) =>{
      if(error){
          console.log(error);
          res.send('error');
      }else{
          console.log('email sent: ' + info.response);
          res.send('success')
      }
  
  })
  } catch (error) {
      console.log(error.message);
    }
  }
   
  module.exports.widthdrawPage_post = async(req, res) =>{
      // const {amount, type, status, narration} = req.body
    try {
      const widthdraw = await Widthdraw.create({
      amount: req.body.amount,
      type: req.body.type,
      status: req.body.status,
      narration: req.body.narration
      });
      widthdraw.save()
      const id = req.params.id;
      const user = await User.findById(id)
      user.widthdraws.push(widthdraw);
      await user.save()
      res.render("widthdrawHistory", {user})
          // if(user){
          //     widthdrawEmail(req.body.amount,req.body.type, req.body.narration )
          // }else{
          //     console.log(error)
          // }
   
    } catch (error) {
      console.log(error)
    }
  
  }



  module.exports.widthdrawHistory = async(req, res) =>{
    const id = req.params.id
      const user = await User.findById(id).populate("widthdraws")
       res.render('widthdrawHistory',{user})
  }
  

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}