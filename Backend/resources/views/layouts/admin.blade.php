<!DOCTYPE html>
<!--
This is a starter template page. Use this page to start your new project from
scratch. This page gets rid of all links and provides the needed markup only.
-->
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AdminLTE 3 | Starter</title>

    <!-- Google Font: Source Sans Pro -->
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="{{ asset('assets/dashboard/plugins/fontawesome-free/css/all.min.css')}}">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('assets/dashboard/dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/dashboard/dist/css/style.css') }}">
    @stack('css')
    <style>
        p{
            margin-bottom: 0 !important;
        }
    </style>
</head>
<body class="hold-transition sidebar-mini">
<div class="wrapper">

    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="index3.html" class="nav-link">Home</a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="#" class="nav-link">Contact</a>
            </li>
        </ul>

        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
            <!-- Navbar Search -->


            <!-- Messages Dropdown Menu -->

            <!-- Notifications Dropdown Menu -->


            <li class="nav-item">
                <a class="nav-link" href="{{route('admin.logout')}}">
                    <i class="fas fa-sign-in-alt"></i>
                </a>
            </li>
        </ul>
    </nav>
    <!-- /.navbar -->

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="index3.html" class="brand-link">
            <img src="{{asset('assets/dashboard/')}}/dist/img/AdminLTELogo.png" alt="AdminLTE Logo"
                 class="brand-image img-circle elevation-3" style="opacity: .8">
            <span class="brand-text font-weight-light">AdminLTE 3</span>
        </a>

        <!-- Sidebar -->
        <div class="sidebar">
            <!-- Sidebar user panel (optional) -->
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                <div class="image">
                    <a href="{{ route('admin.profile') }}"><img src="{{asset('assets/dashboard/')}}/dist/img/user2-160x160.jpg" class="img-circle elevation-2"
                                    alt="User Image"></a>
                </div>
                <div class="info">
                    <a href="{{ route('admin.profile') }}" class="d-block">Alexander Pierce</a>
                </div>
            </div>

            <!-- SidebarSearch Form -->
            <div class="form-inline">
                <div class="input-group" data-widget="sidebar-search">
                    <input class="form-control form-control-sidebar" type="search" placeholder="Search"
                           aria-label="Search">
                    <div class="input-group-append">
                        <button class="btn btn-sidebar">
                            <i class="fas fa-search fa-fw"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                    data-accordion="false">
                    <!-- Add icons to the links using the .nav-icon class
                         with font-awesome or any other icon font library -->
                    <li class="nav-item">
                        <a href="{{route('admin.dashboard')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Dashboard

                            </p>
                        </a>
                    </li>

{{--                    <li class="nav-item">--}}
{{--                        <a href="{{route('admin.subscription.plan')}}" class="nav-link">--}}
{{--                            <i class="nav-icon fas fa-th"></i>--}}
{{--                            <p>--}}
{{--                                Subscription plan--}}

{{--                            </p>--}}
{{--                        </a>--}}
{{--                    </li>--}}

                    <li class="nav-item">
                        <a href="{{route('admin.product.management')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Product Management

                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.credit.plan')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Credit plan

                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.user.index')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                User List
                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.email.template')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Email Template
                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('faqs.index')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Custom Lead Faqs
                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('domain.tracking')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Setup Domain Tracking
                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.instruction.get')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Instruction
                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.unsubscribe.link')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Unsubscribe
                            </p>
                        </a>
                    </li>
                 {{--   <li class="nav-item">
                        <a href="{{route('tanant.user.plan')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Tenant User plan
                            </p>
                        </a>
                    </li>--}}


                    <!-- <li class="nav-item">
                        <a href="{{route('admin.users.plan')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                User Plans

                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.credit.user.list')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                User Credit List

                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.custom.order')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Custom Orders

                            </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{route('admin.create.user')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Create User
                            </p>
                        </a>
                    </li>

                     <li class="nav-item">
                        <a href="{{route('admin.university')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                University

                            </p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="{{route('admin.email.template')}}" class="nav-link">
                            <i class="nav-icon fas fa-th"></i>
                            <p>
                                Email Template

                        <li class="nav-item">
                            <a href="{{route('admin.university')}}" class="nav-link">
                                <i class="nav-icon fas fa-th"></i>
                                <p>
                                    University

                                </p>
                            </a>
                        </li>

                        <li class="nav-item">
                            <a href="{{route('admin.email.template')}}" class="nav-link">
                                <i class="nav-icon fas fa-th"></i>
                                <p>
                                    Email Template

                                </p>
                            </a>
                        </li>
                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            @yield('admin')
        </div>
        <!-- /.content-wrapper -->

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
            <div class="p-3">
                <h5>Title</h5>
                <p>Sidebar content</p>
            </div>
        </aside>
        <!-- /.control-sidebar -->

        <!-- Main Footer -->
        <footer class="main-footer">
            <!-- To the right -->
            <div class="float-right d-none d-sm-inline">
                Anything you want
            </div>
            <!-- Default to the left -->
            <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
        </footer>
    </div>
    <!-- ./wrapper -->

    <!-- REQUIRED SCRIPTS -->

    <!-- jQuery -->
    <script src="{{ asset('assets/dashboard/plugins/jquery/jquery.min.js') }}"></script>
    <!-- Bootstrap 4 -->
    <script src="{{ asset('assets/dashboard/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <!-- AdminLTE App -->
    <script src="{{ asset('assets/dashboard/dist/js/adminlte.min.js') }}"></script>
@stack('js')
</body>

</html>
