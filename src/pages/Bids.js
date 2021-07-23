import React from 'react'
import Footer from './Footer'
import Header from './Header'
import Menu from './admin/Menu'

const Bids = () => {
  return (
    <div>
      <Header />
      <Menu />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Bid On Asset</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Bid On Asset</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          {/* Default box */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Asset</h3>
              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                  <i className="fas fa-minus" />
                </button>
                <button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-8 order-2 order-md-1">
                  <div className="row">
                    {/* <div className="col-12 col-sm-4">
                      <div className="info-box bg-light">
                        <div className="info-box-content">
                          <span className="info-box-text text-center text-muted">Estimated budget</span>
                          <span className="info-box-number text-center text-muted mb-0">2300</span>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-12 col-sm-4">
                      <div className="info-box bg-light">
                        <div className="info-box-content">
                          <span className="info-box-text text-center text-muted">Total amount spent</span>
                          <span className="info-box-number text-center text-muted mb-0">2000</span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <h4>Asset Details</h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-4 order-1 order-md-2">
                  <h3 className="text-primary"><i className="fas fa-laptop" /> Asset Name</h3>
                  {/* <p className="text-muted">Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terr.</p> */}
                  <br />
                  {/* <div className="text-muted">
                    <p className="text-sm">Client Company
                <b className="d-block">Deveint Inc</b>
                    </p>
                    <p className="text-sm">Project Leader
                <b className="d-block">Tony Chicken</b>
                    </p>
                  </div> */}
                  {/* <h5 className="mt-5 text-muted">Project files</h5>
                  <ul className="list-unstyled">
                    <li>
                      <a href className="btn-link text-secondary"><i className="far fa-fw fa-file-word" /> Functional-requirements.docx</a>
                    </li>
                    <li>
                      <a href className="btn-link text-secondary"><i className="far fa-fw fa-file-pdf" /> UAT.pdf</a>
                    </li>
                    <li>
                      <a href className="btn-link text-secondary"><i className="far fa-fw fa-envelope" /> Email-from-flatbal.mln</a>
                    </li>
                    <li>
                      <a href className="btn-link text-secondary"><i className="far fa-fw fa-image " /> Logo.png</a>
                    </li>
                    <li>
                      <a href className="btn-link text-secondary"><i className="far fa-fw fa-file-word" /> Contract-10_12_2014.docx</a>
                    </li>
                  </ul> */}
                  <div className="col-12 col-sm-12">
                      <div className="info-box bg-light">
                        <div className="info-box-content">
                          <span className="info-box-text text-center text-muted">Minimum Bid Amount</span>
                          <span className="info-box-number text-center text-muted mb-0">20</span>
                        </div>
                      </div>
                    </div>
                  <div className="form-group">
                  <h6>Bid Amount:</h6>
                    <input type="number" maxLength="20" className="form-control" placeholder="Bid Amount" />
                </div>
                  <div className="text-center mt-5 mb-3">
                    <a href="#" className="btn btn-sm btn-primary float-right">Bid</a>
                    <a href="#" className="btn btn-sm btn-warning float-left">Cancel</a>
                  </div>
                </div>
              </div>
            </div>
            {/* /.card-body */}
          </div>
          {/* /.card */}
        </section>
        {/* /.content */}
      </div>

      <Footer />
    </div>
  )
}

export default Bids
