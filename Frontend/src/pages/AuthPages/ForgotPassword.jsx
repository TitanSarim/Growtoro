import { useUser } from 'context/UserContext';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { BUSINESS_DOMAIN_URL } from 'utils/constant';

const ForgotPassword = () => {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState('');
  const { forgotPassword, resetPassword, isAuthLoading } = useUser();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [formErrors, setFormErrors] = useState({
    password: null,
  });
  const emailId = searchParams.get('email');
  const _token = searchParams.get('token');
  const [resetPass, setResetPass] = useState({
    email: emailId,
    token: _token,
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    if (emailId && _token) {
      if (resetPass.password.length < 6) {
        setFormErrors((prev) => ({ ...prev, password: 'Enter a password with at least 6 characters' }));
      } else {
        setFormErrors((prev) => ({ ...prev, password: null }));
        resetPassword(resetPass);
      }
    } else {
      forgotPassword(email);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 900);
  }, []);

  return (
    <div style={{ opacity: show ? 1 : 0, transition: 'all', transitionDuration: 3 }}>
      <Helmet>
        <link
          href="/assets/authassets/login.css"
          // href="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/css/growtoro-2-0.webflow.b697d0fc2.css"
          rel="stylesheet"
          type="text/css"
        />
      </Helmet>
      <div className="overflow-hidden">
        <div className="section login-page wf-section">
          <div
            data-w-id="def758f1-11b1-717e-15d5-59cd00b43be9"
            data-animation="over-right"
            data-collapse="medium"
            data-duration="400"
            data-easing="ease"
            data-easing2="ease"
            role="banner"
            className="nav-wrapper before w-nav"
            style={{ width: '100%' }}
          >
            <div className="navbar-shadow-background" />
            <div className="nav-container w-container">
              <div className="_2 flex-wrapper-copy">
                <Link to="/" className="branding w-nav-brand">
                  <img
                    src="/assets/images/screens (24).png"
                    loading="lazy"
                    sizes="(max-width: 479px) 100vw, 140px"
                    srcSet="/assets/images/screens-500.png 500w, /assets/images/screens-800.png 800w, /assets/images/screens-1080.png 1080w,  /assets/images/screens (24).png 1080w"
                    alt=""
                  />
                </Link>
                <nav role="navigation" className="nav-menu-3 w-nav-menu">
                  <div className="mobile-logo">
                    <Link to="/" className="link-block-10 w-inline-block">
                      <img
                        src="/assets/images/screens (24).png"
                        loading="lazy"
                        sizes="100vw"
                        srcSet="/assets/images/screens-500.png 500w, /assets/images/screens-800.png 800w, /assets/images/screens-1080.png 1080w,  /assets/images/screens (24).png 1080w"
                        alt=""
                        className="on-mobile on-mbile image-22 image-23 image-24 image-25 image-26 image-27 image-28 image-29 image-30 image-31 image-32 image-33 image-34 image-35 image-36 image-37 image-38 image-39 image-40 image-41 image-42 image-43 image-44 image-45 image-46 image-47 image-48 image-49 image-50 image-51 image-52 image-53 image-54 image-55 image-56 image-57 image-58 image-59"
                      />
                    </Link>
                  </div>
                  <div className="menu-list">
                    <div data-hover="true" data-delay="0" className="dropdown-2 w-dropdown">
                      <div className="dropdown-toggle-2 w-dropdown-toggle">
                        <div className="dropdown-toggle-text">Product</div>
                        <img
                          src="/assets/images/down-arrow.png"
                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/639d67948e7435178b730e3f_down-arrow.png"
                          loading="lazy"
                          alt=""
                          className="image"
                        />
                      </div>
                      <nav className="dropdown-list-2 w-dropdown-list">
                        <div className="dropdown-overflow">
                          <div className="dropdown-inner-shadow" />
                          <div className="dropdown-bg">
                            <div className="dropdown-bg-full" />
                          </div>
                          <div className="dropdown-list-body">
                            <div className="container-2">
                              <div className="dropdown-grid">
                                <div className="dropdown-column second">
                                  <div className="dropdown-column-title">product</div>
                                  <div className="dropdown-subgrid">
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c03"
                                        href={`${BUSINESS_DOMAIN_URL}/features/email-sequences`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba0a4b8f444837a685c89_icons8-paper-plane-50%20(1).png"
                                          src="/assets/images/paper-plane.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Email Sequences</div>
                                          <p className="dropdown-card-text">
                                            Create automated &amp; personalized email sequences
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c0b"
                                        href={`${BUSINESS_DOMAIN_URL}/features/data-marketplace`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba0a48128d6b4fb374178_icons8-database-export-50%20(1).png"
                                          src="/assets/images/database-export.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Contact Database</div>
                                          <p className="dropdown-card-text">
                                            Search through the world&#x27;s leading contact database
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu hide">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c13"
                                        href="#"
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba0a30c59e8197ff5c487_icons8-web-design-50%20(1).png"
                                          src="/assets/images/web-design.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Template Creator</div>
                                          <p className="dropdown-card-text">
                                            Crea un hermoso diagrama de Gantt en minutos
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c1b"
                                        href={`${BUSINESS_DOMAIN_URL}/features/email-warmup`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba09f873b2bb65233ec36_icons8-fire-50%20(1).png"
                                          src="/assets/images/fire.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Email Warmup</div>
                                          <p className="dropdown-card-text">
                                            Automatically warm your email accounts up for amazing deliverability
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="7407f328-a183-addb-8032-d404203221c7"
                                        href={`${BUSINESS_DOMAIN_URL}/features/growtoro-gpt`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/643350ccab91bb7f139d3da0_GrowtoroGPT_Mega_Menu_Icon.svg"
                                          src="/assets/icons/brain_icon.svg"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">GrowtoroGPT</div>
                                          <p className="dropdown-card-text">
                                            Use the full force of GPT-4 to rapidly create winning content
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c23"
                                        href={`${BUSINESS_DOMAIN_URL}/features/templates`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba094a88697cb1987255a_icons8-documents-50%20(1).png"
                                          src="/assets/images/documents.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Template Library</div>
                                          <p className="dropdown-card-text">
                                            Choose from our deep library of high converting templates
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c2b"
                                        href={`${BUSINESS_DOMAIN_URL}/features/custom-list-creator`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba09409ae2ad3246df07d_icons8-data-sheet-50%20(1).png"
                                          src="/assets/images/data-sheet.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Custom List Creator</div>
                                          <p className="dropdown-card-text">
                                            Create custom lead orders for any lead request imaginable
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c33"
                                        href={`${BUSINESS_DOMAIN_URL}/features/unibox`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba093c0c7e5456805388e_icons8-communication-50%20(1).png"
                                          src="/assets/images/communication.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Unibox</div>
                                          <p className="dropdown-card-text">
                                            All of your campaign responses in one universal inbox
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c3b"
                                        href={`${BUSINESS_DOMAIN_URL}/features/growth-university`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba0924a51be8f9705fa0d_icons8-university-50%20(1).png"
                                          src="/assets/images/university.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Growth University</div>
                                          <p className="dropdown-card-text">
                                            Learn from the best and the brightest in growth marketing
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="cta-all-featured">
                                    <a href={`${BUSINESS_DOMAIN_URL}/pricing-1`} className="all-featured w-button">
                                      See Monthly Plans
                                    </a>
                                  </div>
                                </div>
                                <div className="dropdown-column third">
                                  <div className="sidebar-column-bg" />
                                  <div className="dropdown-column-title">Todos Los planes</div>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43c49"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#basic" fill="#646f79" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Basic</div>
                                      <p className="dropdown-card-text">
                                        Para que la gestión de proyectos y tareas sea más sencilla. Gratis para equipos
                                        de hasta 15 integrantes.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43c51"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#premium" fill="#fcbd01" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Premium</div>
                                      <p className="dropdown-card-text">
                                        Para una planificación y gestión efectivas de los proyectos de tus equipos.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43c59"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#business" fill="#14aaf5" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Business</div>
                                      <p className="dropdown-card-text">
                                        Para la gestión de iniciativas a gran escala y la mejora de la colaboración
                                        entre los equipos.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43c61"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#cronogram" fill="#ff5263" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Enterprise</div>
                                      <p className="dropdown-card-text">
                                        Para organizaciones que necesitan seguridad, control y asistencia extra.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43c69"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#cog" fill="#796eff" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title not-margin">Compara todos lo planes</div>
                                    </div>
                                    <div className="dropdown-card-icon arrow w-embed">
                                      <svg
                                        viewBox="0 0 14 11"
                                        preserveAspectRatio="xMinYMin"
                                        style={{ fill: '#646f79' }}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9.827.144L9.019.86l3.256 3.738H0V5.69h12.275L9.02 9.427l.808.717 4.173-5-4.173-5z"
                                        />
                                      </svg>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="dropdown-footer-full">
                            <div className="dropdown-footer-wrapper" />
                          </div>
                        </div>
                      </nav>
                    </div>
                    <div data-hover="true" data-delay="0" className="dropdown-2 w-dropdown">
                      <div className="dropdown-toggle-2 w-dropdown-toggle">
                        <div className="dropdown-toggle-text">Solutions</div>
                        <img
                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/639d67948e7435178b730e3f_down-arrow.png"
                          src="/assets/images/down-arrow.png"
                          loading="lazy"
                          alt=""
                          className="image"
                        />
                      </div>
                      <nav className="dropdown-list-2 w-dropdown-list">
                        <div className="dropdown-overflow">
                          <div className="dropdown-inner-shadow" />
                          <div className="dropdown-bg">
                            <div className="dropdown-bg-full" />
                          </div>
                          <div className="dropdown-list-body">
                            <div className="container-2">
                              <div className="dropdown-grid">
                                <div className="dropdown-column second">
                                  <div className="dropdown-column-title">SOLUTIONS</div>
                                  <div className="dropdown-subgrid">
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c8d"
                                        href={`${BUSINESS_DOMAIN_URL}/solutions/ecommerce`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          src="/assets/images/shop-payment.png"
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba4ee277106236f710842_icons8-mobile-shop-payment-50%20(1).png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">eCommerce</div>
                                          <p className="dropdown-card-text">
                                            Grow your brand ambassadors, affiliates, newsletter list &amp; customers
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c95"
                                        href={`${BUSINESS_DOMAIN_URL}/solutions/wholesale`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          src="/assets/images/manufacturing.png"
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba4ef20beacfb6a993fa7_icons8-manufacturing-50%20(1).png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Wholesale</div>
                                          <p className="dropdown-card-text">
                                            Gain more wholesale accounts for your product sales
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43c9d"
                                        href={`${BUSINESS_DOMAIN_URL}/solutions/freelancers`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          src="/assets/images/workspace.png"
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba4ef7fbebb1ddc431c71_icons8-workspace-50%20(1).png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Freelancers</div>
                                          <p className="dropdown-card-text">
                                            Get more paid gigs and grow your client base
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43ca5"
                                        href={`${BUSINESS_DOMAIN_URL}/solutions/agencies`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba4ed277106aa7d710820_icons8-meeting-room-50%20(1).png"
                                          src="/assets/images/meeting-room.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Agencies</div>
                                          <p className="dropdown-card-text">
                                            Grow your client roster and get new customers
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="cta-all-featured">
                                    <a href={`${BUSINESS_DOMAIN_URL}/pricing-1`} className="all-featured pink w-button">
                                      See Monthly Plans
                                    </a>
                                  </div>
                                </div>
                                <div className="dropdown-column third">
                                  <div className="sidebar-column-bg" />
                                  <div className="dropdown-column-title">Todos Los planes</div>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43cb3"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#basic" fill="#646f79" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Basic</div>
                                      <p className="dropdown-card-text">
                                        Para que la gestión de proyectos y tareas sea más sencilla. Gratis para equipos
                                        de hasta 15 integrantes.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43cbb"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#premium" fill="#fcbd01" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Premium</div>
                                      <p className="dropdown-card-text">
                                        Para una planificación y gestión efectivas de los proyectos de tus equipos.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43cc3"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#business" fill="#14aaf5" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Business</div>
                                      <p className="dropdown-card-text">
                                        Para la gestión de iniciativas a gran escala y la mejora de la colaboración
                                        entre los equipos.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43ccb"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#cronogram" fill="#ff5263" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Enterprise</div>
                                      <p className="dropdown-card-text">
                                        Para organizaciones que necesitan seguridad, control y asistencia extra.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43cd3"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#cog" fill="#796eff" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title not-margin">Compara todos lo planes</div>
                                    </div>
                                    <div className="dropdown-card-icon arrow w-embed">
                                      <svg
                                        viewBox="0 0 14 11"
                                        preserveAspectRatio="xMinYMin"
                                        style={{ fill: '#646f79' }}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9.827.144L9.019.86l3.256 3.738H0V5.69h12.275L9.02 9.427l.808.717 4.173-5-4.173-5z"
                                        />
                                      </svg>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="dropdown-footer-full">
                            <div className="dropdown-footer-wrapper" />
                          </div>
                        </div>
                      </nav>
                    </div>
                    <div data-hover="true" data-delay="0" className="dropdown-2 w-dropdown">
                      <div className="dropdown-toggle-2 w-dropdown-toggle">
                        <div className="dropdown-toggle-text">
                          <span>Resources</span>
                        </div>
                        <img
                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/639d67948e7435178b730e3f_down-arrow.png"
                          src="/assets/images/down-arrow.png"
                          loading="lazy"
                          alt=""
                          className="image"
                        />
                      </div>
                      <nav className="dropdown-list-2 w-dropdown-list">
                        <div className="dropdown-overflow">
                          <div className="dropdown-inner-shadow" />
                          <div className="dropdown-bg">
                            <div className="dropdown-bg-full" />
                          </div>
                          <div className="dropdown-list-body">
                            <div className="container-2">
                              <div className="dropdown-grid">
                                <div className="dropdown-column second">
                                  <div className="dropdown-column-title">RESOURCES</div>
                                  <div className="dropdown-subgrid">
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43cf7"
                                        href={`${BUSINESS_DOMAIN_URL}/blog`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          src="/assets/images/blogger.png"
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba881025bb1c9bb48f9f1_icons8-blogger-50.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Blog</div>
                                          <p className="dropdown-card-text">
                                            Learn new growth insights and tips to help you grow
                                          </p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu">
                                      <a
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43cff"
                                        href={`${BUSINESS_DOMAIN_URL}/customers`}
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba880f3377e88964fb7fc_icons8-batch-assign-50.png"
                                          src="/assets/images/batch-assign.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Customers</div>
                                          <p className="dropdown-card-text">Check out our customer success stories</p>
                                        </div>
                                      </a>
                                    </div>
                                    <div className="card-menu signup">
                                      <Link
                                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43d0f"
                                        to="/sign-up"
                                        className="dropdown-card has-icon w-inline-block"
                                      >
                                        <img
                                          // src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63eba883f57cf6a026e4ca0b_icons8-sign-up-50.png"
                                          src="/assets/images/sign-up.png"
                                          loading="lazy"
                                          alt=""
                                          className="image-2"
                                        />
                                        <div className="dropdown-card-content">
                                          <div className="dropdown-card-title">Sign Up</div>
                                          <p className="dropdown-card-text">Sign up and start growing today</p>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="cta-all-featured">
                                    <a href={`${BUSINESS_DOMAIN_URL}/pricing-1`} className="all-featured w-button">
                                      See Monthly Plans
                                    </a>
                                  </div>
                                </div>
                                <div className="dropdown-column third">
                                  <div className="sidebar-column-bg" />
                                  <div className="dropdown-column-title">Todos Los planes</div>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43d1d"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#basic" fill="#646f79" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Basic</div>
                                      <p className="dropdown-card-text">
                                        Para que la gestión de proyectos y tareas sea más sencilla. Gratis para equipos
                                        de hasta 15 integrantes.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43d25"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#premium" fill="#fcbd01" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Premium</div>
                                      <p className="dropdown-card-text">
                                        Para una planificación y gestión efectivas de los proyectos de tus equipos.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43d2d"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#business" fill="#14aaf5" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Business</div>
                                      <p className="dropdown-card-text">
                                        Para la gestión de iniciativas a gran escala y la mejora de la colaboración
                                        entre los equipos.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43d35"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#cronogram" fill="#ff5263" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title">Enterprise</div>
                                      <p className="dropdown-card-text">
                                        Para organizaciones que necesitan seguridad, control y asistencia extra.
                                      </p>
                                    </div>
                                  </a>
                                  <a
                                    data-w-id="def758f1-11b1-717e-15d5-59cd00b43d3d"
                                    href="#"
                                    className="dropdown-card has-icon w-inline-block"
                                  >
                                    <div className="dropdown-card-bg white" />
                                    <div className="dropdown-card-icon w-embed">
                                      <svg viewBox="0 0 32 32">
                                        <use xlinkHref="#cog" fill="#796eff" />
                                      </svg>
                                    </div>
                                    <div className="dropdown-card-content">
                                      <div className="dropdown-card-title not-margin">Compara todos lo planes</div>
                                    </div>
                                    <div className="dropdown-card-icon arrow w-embed">
                                      <svg
                                        viewBox="0 0 14 11"
                                        preserveAspectRatio="xMinYMin"
                                        style={{ fill: '#646f79' }}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9.827.144L9.019.86l3.256 3.738H0V5.69h12.275L9.02 9.427l.808.717 4.173-5-4.173-5z"
                                        />
                                      </svg>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="dropdown-footer-full" />
                        </div>
                      </nav>
                    </div>
                    <a href={`${BUSINESS_DOMAIN_URL}/pricing-1`} className="link-nav w-nav-link">
                      Pricing
                    </a>
                  </div>
                  <div className="relative-block">
                    <div className="cta-navbar before">
                      <a
                        href={`${BUSINESS_DOMAIN_URL}/contact`}
                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43d52"
                        className="nav-link-2 w-nav-link"
                      >
                        Contact Sales
                      </a>
                      <Link
                        to="/login"
                        data-w-id="def758f1-11b1-717e-15d5-59cd00b43d56"
                        aria-current="page"
                        className="sign-up-cta _02 w-nav-link w--current"
                        style={{ backgroundColor: 'rgb(177, 59, 237)' }}
                      >
                        Log in
                      </Link>
                    </div>
                    <div className="cta-navbar after">
                      <a
                        href="#"
                        data-w-id="fc84a43c-8b33-26aa-174f-6d036da2ae8b"
                        className="nav-link-black w-nav-link"
                      >
                        Contact Sales
                      </a>
                      <Link
                        to="/login"
                        aria-current="page"
                        className="sign-up-cta _02-copy w-nav-link w--current"
                        style={{ backgroundColor: 'rgb(177, 59, 237)' }}
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </nav>
                <div className="menu-button-2 w-nav-button">
                  <div className="humberger">
                    <div
                      data-is-ix2-target="1"
                      className="lottie-animation"
                      data-w-id="42b14e88-d761-d8ce-d13c-dea75b366dbb"
                      data-animation-type="lottie"
                      // data-src="https://uploads-ssl.webflow.com/639ca3bff74e755905243b32/63a5c485ea7e9c1f5548c0e2_76866-hamburger.json"                      data-src="/assets/authassets/login.json"
                      data-src="/assets/authassets/login.json"
                      data-loop="0"
                      data-direction="1"
                      data-autoplay="0"
                      data-renderer="svg"
                      data-default-duration="3"
                      data-duration="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {emailId && _token ? (
            <div className="container w-container">
              <div className="sign-in-form-container---brix preview-page">
                <div className="sign-in-form-wrapper---brix">
                  <div className="sign-in-form-block---brix sign-in-v3---brix w-form  full-opacity">
                    <div
                      id="wf-form-Forgot-Password-Form"
                      name="wf-form-Forgot-Password-Form"
                      data-name="Forgot Password Form"
                      method="get"
                      className="sign-in-form-v2---brix padding-top"
                    >
                      <div className="title-container---brix">
                        <Link to="/login" className="maxw-64 w-inline-block">
                          <img width="200" loading="lazy" src="/assets/images/key.png" alt="" className="_w-100" />
                        </Link>
                        <h1 className="heading-32 font-inter mt-30">Reset password?</h1>
                      </div>
                      <div className="password-field">
                        <input
                          value={resetPass.password}
                          onChange={(event) => setResetPass((prev) => ({ ...prev, password: event.target.value }))}
                          type="password"
                          className="text-input bg w-input"
                          maxLength="256"
                          name="Password"
                          data-name="Password"
                          placeholder="Change Password"
                          id="input-password"
                          data-password="false"
                          required=""
                        />
                      </div>
                      <div className="password-field">
                        <input
                          value={resetPass.password_confirmation}
                          onChange={(event) =>
                            setResetPass((prev) => ({ ...prev, password_confirmation: event.target.value }))
                          }
                          type="password"
                          className="text-input bg w-input"
                          maxLength="256"
                          name="Password"
                          data-name="Password"
                          placeholder="Confirm Password"
                          id="input-password"
                          data-password="false"
                          required=""
                        />
                      </div>
                      {!!formErrors.password && (
                        <div style={{ textAlign: 'left', marginTop: '0.2rem', color: 'red' }}>
                          <small>{formErrors.password}</small>
                        </div>
                      )}
                      <input
                        onClick={submit}
                        type="submit"
                        value={isAuthLoading.resetPassword ? 'Loading...' : 'Send Link'}
                        data-wait="Please wait..."
                        className="btn-login mt-15 w-button"
                        style={{ backgroundColor: isAuthLoading.resetPassword ? '#DBDADA' : '' }}
                        disabled={isAuthLoading.resetPassword}
                      />
                    </div>
                    <div className="succes-message---brix w-form-done">
                      <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="error-message---brix w-form-fail">
                      <div>Oops! Something went wrong while submitting the form.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container w-container">
              <div className="sign-in-form-container---brix preview-page">
                <div className="sign-in-form-wrapper---brix">
                  <div className="sign-in-form-block---brix sign-in-v3---brix w-form full-opacity">
                    <div
                      id="wf-form-Forgot-Password-Form"
                      name="wf-form-Forgot-Password-Form"
                      data-name="Forgot Password Form"
                      method="get"
                      className="sign-in-form-v2---brix padding-top"
                    >
                      <div className="title-container---brix">
                        <Link to="/" className="maxw-64 w-inline-block">
                          <img width="200" loading="lazy" src="/assets/images/key.png" alt="" className="_w-100" />
                        </Link>
                        <h1 className="heading-32 font-inter mt-30">Forgot password?</h1>
                        <p className="pra-16 mt-10">Please verify your email address</p>
                      </div>
                      <input
                        type="text"
                        className="text-input w-input"
                        maxLength="256"
                        name="Enter-your-mail"
                        data-name="Enter your mail"
                        placeholder="Enter your mail"
                        id="Enter-your-mail"
                        required=""
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <input
                        onClick={submit}
                        type="submit"
                        value={isAuthLoading.forgotPassword ? 'Loading...' : 'Send Link'}
                        data-wait="Please wait..."
                        className="btn-login mt-15 w-button"
                        style={{ backgroundColor: isAuthLoading.forgotPassword ? '#DBDADA' : '' }}
                        disabled={isAuthLoading.forgotPassword}
                      />
                      <div className="text-12 mt-30">
                        <Link to="#" className="link-pass" onClick={submit}>
                          Click here{' '}
                        </Link>
                        to resend the email link
                      </div>
                    </div>
                    <div className="succes-message---brix w-form-done">
                      <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="error-message---brix w-form-fail">
                      <div>Oops! Something went wrong while submitting the form.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Helmet>
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=639ca3bff74e755905243b32"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        />
        <script src="/assets/authassets/login.js" type="text/javascript" />
      </Helmet>
    </div>
  );
};

export default ForgotPassword;
