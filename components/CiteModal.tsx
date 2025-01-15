'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { GetPublicationById } from '@/lib/actions/pubs.actions';

type CiteModalProps = {
  handleClose: () => void;
  pub_Id: string;
};

const CiteModal = ({ handleClose, pub_Id }: CiteModalProps) => {
        console.log(pub_Id)
  const [open, setOpen] = useState(true);
  const [publication, setpublication] = useState<any>(null);

  useEffect(() => {
    if (!pub_Id) {
      console.warn("pub_Id is undefined. Skipping fetch.");
      return;
    }

    const fetchPublication = async () => {
      try {
        const result = await GetPublicationById(pub_Id);
        setpublication(result);

      } catch (error) {
        console.error("Error fetching publication:", error);
      }
    };

    fetchPublication();
  }, [pub_Id]);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <DialogTitle as="h3" className="text-base font-semibold text-center text-gray-900">
                CITE
              </DialogTitle>
              <div className="mt-2">
                {publication ? (
                  <p className="text-sm text-gray-500">
                    APA: <span className="text-sm text-black">
                      {publication.owner?.fullName || "Unknown Author"} ({new Date(publication.$createdAt).toLocaleDateString()}) {publication.title || "Untitled"}.
                      {publication.version || ''}.
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Loading publication details...</p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CiteModal;
