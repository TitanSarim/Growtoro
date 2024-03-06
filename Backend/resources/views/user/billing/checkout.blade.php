<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <style>
        body {
            background: #eee;
        }

        .card {
            box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
        }

        .card {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: #fff;
            background-clip: border-box;
            border: 0 solid rgba(0, 0, 0, .125);
            border-radius: 1rem;
        }

        .card-body {
            -webkit-box-flex: 1;
            -ms-flex: 1 1 auto;
            flex: 1 1 auto;
            padding: 1.5rem 1.5rem;
        }
    </style>
</head>
<body>
<div class="container">
    <h1 class="h3 mb-5">Payment</h1>
    <form action="{{route('user.checkout.submit')}}" method="post">
        @csrf
        <div class="row">


            <!-- Left -->
            <div class="col-lg-9">
                <div class="accordion" id="accordionPayment">
                    <!-- Credit card -->
                    <div class="accordion-item mb-3">
                        <h2 class="h5 px-4 py-3 accordion-header d-flex justify-content-between align-items-center">
                            <div class="form-check w-100 collapsed" data-bs-toggle="collapse"
                                 data-bs-target="#collapseCC"
                                 aria-expanded="false">
                                <input class="form-check-input" type="radio" name="payment" id="payment1">
                                <label class="form-check-label pt-1" for="payment1">
                                    Credit Card
                                </label>
                            </div>
                            <span>
                <svg width="34" height="25" xmlns="http://www.w3.org/2000/svg">
                  <g fill-rule="nonzero" fill="#333840">
                    <path
                        d="M29.418 2.083c1.16 0 2.101.933 2.101 2.084v16.666c0 1.15-.94 2.084-2.1 2.084H4.202A2.092 2.092 0 0 1 2.1 20.833V4.167c0-1.15.941-2.084 2.102-2.084h25.215ZM4.203 0C1.882 0 0 1.865 0 4.167v16.666C0 23.135 1.882 25 4.203 25h25.215c2.321 0 4.203-1.865 4.203-4.167V4.167C33.62 1.865 31.739 0 29.418 0H4.203Z"></path>
                    <path
                        d="M4.203 7.292c0-.576.47-1.042 1.05-1.042h4.203c.58 0 1.05.466 1.05 1.042v2.083c0 .575-.47 1.042-1.05 1.042H5.253c-.58 0-1.05-.467-1.05-1.042V7.292Zm0 6.25c0-.576.47-1.042 1.05-1.042H15.76c.58 0 1.05.466 1.05 1.042 0 .575-.47 1.041-1.05 1.041H5.253c-.58 0-1.05-.466-1.05-1.041Zm0 4.166c0-.575.47-1.041 1.05-1.041h2.102c.58 0 1.05.466 1.05 1.041 0 .576-.47 1.042-1.05 1.042H5.253c-.58 0-1.05-.466-1.05-1.042Zm6.303 0c0-.575.47-1.041 1.051-1.041h2.101c.58 0 1.051.466 1.051 1.041 0 .576-.47 1.042-1.05 1.042h-2.102c-.58 0-1.05-.466-1.05-1.042Zm6.304 0c0-.575.47-1.041 1.051-1.041h2.101c.58 0 1.05.466 1.05 1.041 0 .576-.47 1.042-1.05 1.042h-2.101c-.58 0-1.05-.466-1.05-1.042Zm6.304 0c0-.575.47-1.041 1.05-1.041h2.102c.58 0 1.05.466 1.05 1.041 0 .576-.47 1.042-1.05 1.042h-2.101c-.58 0-1.05-.466-1.05-1.042Z"></path>
                  </g>
                </svg>
              </span>
                        </h2>


                        <div id="collapseCC" class="accordion-collapse collapse show" data-bs-parent="#accordionPayment"
                             style="">
                            <div class="accordion-body">

                                <div class="row">
                                    <div class="col-lg-4">
                                        <div class="mb-3">
                                            <label class="form-label">Name</label>
                                            <input type="text" class="form-control" name="name"
                                                   value="{{Auth::user()->name}}" placeholder="">
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input type="text" class="form-control" name="email"
                                                   value="{{Auth::user()->email}}"
                                                   placeholder="MM/YY">
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="mb-3">
                                            <label class="form-label">Phone Number</label>
                                            <input type="password" class="form-control" name="phone">
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="mb-3">
                                            <label class="form-label">Address</label>
                                            <input type="password" class="form-control" name="address">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr>

                        <div id="collapseCC" class="accordion-collapse collapse show" data-bs-parent="#accordionPayment"
                             style="">
                            <div class="accordion-body">
                                <div class="mb-3">
                                    <label class="form-label">Card Number</label>
                                    <input type="text" class="form-control" name="card" placeholder="">

                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label class="form-label">Name on card</label>
                                            <input type="text" class="form-control" name="card_name" placeholder="">
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="mb-3">
                                            <label class="form-label">Expiry date</label>
                                            <input type="text" class="form-control" name="expire" placeholder="MM/YY">
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="mb-3">
                                            <label class="form-label">CVV Code</label>
                                            <input type="password" class="form-control" name="cvc">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- PayPal -->

                </div>
            </div>

            <!-- Right -->
            <?php
            $carts = \Gloudemans\Shoppingcart\Facades\Cart::content();
            $subtotal = \Gloudemans\Shoppingcart\Facades\Cart::content()->sum('price');
            $counts = \Gloudemans\Shoppingcart\Facades\Cart::content()->count();
            ?>
            <input type="hidden" class="form-control" name="plan_amount" value="{{number_format($subtotal,2)}}"
            >

            <div class="col-lg-3">
                <div class="card position-sticky top-0">
                    <div class="p-3 bg-light bg-opacity-10">
                        <h6 class="card-title mb-3">Order Summary</h6>
                        <div class="d-flex justify-content-between mb-1 small">
                            <span>Subtotal</span> <span>${{number_format($subtotal,2)}}</span>
                        </div>


                        <hr>
                        <div class="d-flex justify-content-between mb-4 small">
                            <span>TOTAL</span> <strong class="text-dark">${{number_format($subtotal,2)}}</strong>
                        </div>
                        <div class="form-check mb-1 small">
                            <input class="form-check-input" type="checkbox" value="" id="tnc">
                            <label class="form-check-label" for="tnc">
                                I agree to the <a href="#">terms and conditions</a>
                            </label>
                        </div>
                        <div class="form-check mb-3 small">
                            <input class="form-check-input" type="checkbox" value="" id="subscribe">
                            <label class="form-check-label" for="subscribe">
                                Get emails about product updates and events. If you change your mind, you can
                                unsubscribe at
                                any time. <a href="#">Privacy Policy</a>
                            </label>
                        </div>
                        <button class="btn btn-primary w-100 mt-2" type="submit">Place order</button>
                    </div>
                </div>
            </div>


        </div>
    </form>
</div>
</body>
</html>
