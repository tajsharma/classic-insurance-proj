import React from "react";

interface QuoteSendModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: number;
    onSendQuote: (quoteDetails: any) => void;
}

const QuoteSendModal: React.FC<QuoteSendModalProps> = ({ isOpen, onClose, customerId, onSendQuote }) => {
    const [quoteDetails, setQuoteDetails] = React.useState({
        insuranceType: "",
        monthlyPremium: "",
        annualPremium: "",
        deductible: "",
        liabilityCoverageLimits: "",
        compAndCollisionCoverageLimits: "",
        optionalCoverageCosts: "",
        feesAndTaxes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuoteDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSendQuote({ customerId, ...quoteDetails });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white border-4 border-orange-400 rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Send Quote</h2>
                <div className="space-y-4">
                    {Object.keys(quoteDetails).map((key) => (
                        <div key={key}>
                            <label className="block text-blue-900 font-semibold mb-2">
                                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                            </label>
                            <input
                                type="text"
                                name={key}
                                value={(quoteDetails as any)[key]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-blue-900 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-orange-400 text-blue-900 font-bold py-2 px-6 rounded-lg hover:bg-orange-500 transition duration-200"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteSendModal;
