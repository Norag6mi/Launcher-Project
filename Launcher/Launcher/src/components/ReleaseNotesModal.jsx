function ReleaseNotesModal({version, releaseNotes, onClose}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* e.stopPropagation prevents clicking the modal card from closing the overlay */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="modal-title">Patch Notes</h2>
                <h3 className="modal-subtitle">Version {version}</h3>

                <div className="modal-body">
                    {releaseNotes || "System update complete. No specific release notes have been provided for this version. Dive in and explore the changes!"}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="primary-btn" onClick={onClose} style={{ marginTop: 0, padding: "12px 24px" }}>
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReleaseNotesModal;